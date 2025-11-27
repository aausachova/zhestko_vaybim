const Docker = require('dockerode');
const tar = require('tar-stream');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const DEFAULT_LIMITS = Object.freeze({
    memoryMb: 128,
    memorySwapMb: null,
    nanoCpus: 500000000, // ~0.5 CPU
    cpuShares: 512,
    cpuPeriod: null,
    cpuQuota: null,
    pidsLimit: 64,
    noFile: 512,
    tmpfsMb: 0,
    capDrop: ['NET_RAW', 'SYS_MODULE', 'SYS_PTRACE', 'SYS_ADMIN'],
    securityOpt: ['no-new-privileges:true']
});

const DEFAULT_TIMEOUTS = Object.freeze({
    compileMs: 15000,
    runMs: 2000
});

function toBytes(mbValue, fallbackMb) {
    const baseMb = typeof mbValue === 'number' ? mbValue : fallbackMb;
    const value = typeof baseMb === 'number' ? baseMb : DEFAULT_LIMITS.memoryMb;
    return Math.max(value, 16) * 1024 * 1024;
}

function mergeTimeouts(overrides = {}) {
    return { ...DEFAULT_TIMEOUTS, ...overrides };
}

const CLEANUP_SCRIPT = `
for proc in /proc/[0-9]*; do
  pid=$(basename "$proc")
  if [ "$pid" -le 1 ] || [ "$pid" -eq "$$" ]; then
    continue
  fi
  kill -KILL "$pid" 2>/dev/null || true
done
true
`.trim();

async function cleanupContainerProcesses(container) {
    try {
        await execCommand(container, ['sh', '-c', CLEANUP_SCRIPT], '', 2000);
    } catch (err) {
        const shortId = typeof container.id === 'string' ? container.id.substring(0, 12) : 'unknown';
        console.warn(`[WARN] Cleanup failed for container ${shortId}: ${err.message}`);
    }
}

function mergeLimits(overrides = {}) {
    const merged = { ...DEFAULT_LIMITS, ...overrides };
    merged.capDrop = (overrides.capDrop || DEFAULT_LIMITS.capDrop).slice();
    merged.securityOpt = (overrides.securityOpt || DEFAULT_LIMITS.securityOpt).slice();
    return merged;
}

function buildHostConfig(limits) {
    const hostConfig = {
        Memory: toBytes(limits.memoryMb, DEFAULT_LIMITS.memoryMb),
        MemorySwap: toBytes(
            limits.memorySwapMb ?? limits.memoryMb,
            limits.memoryMb ?? DEFAULT_LIMITS.memoryMb
        ),
        NanoCpus: limits.nanoCpus,
        CpuShares: limits.cpuShares,
        PidsLimit: limits.pidsLimit
    };

    if (typeof limits.cpuPeriod === 'number') hostConfig.CpuPeriod = limits.cpuPeriod;
    if (typeof limits.cpuQuota === 'number') hostConfig.CpuQuota = limits.cpuQuota;
    if (limits.noFile) {
        hostConfig.Ulimits = [{ Name: 'nofile', Soft: limits.noFile, Hard: limits.noFile }];
    }
    if (limits.tmpfsMb) {
        hostConfig.Tmpfs = { '/tmp': `rw,exec,nosuid,nodev,size=${limits.tmpfsMb}m` };
    }
    if (limits.capDrop?.length) hostConfig.CapDrop = limits.capDrop;
    if (limits.securityOpt?.length) hostConfig.SecurityOpt = limits.securityOpt;

    return hostConfig;
}

// --- LANGUAGE CONFIGURATION ---
const LANGUAGES = {
    // 1. JAVASCRIPT
    javascript: {
        image: 'node:18-alpine',
        fileName: 'main.js',
        compileCmd: null,
        runCmd: ['node', 'main.js'],
        limits: { memoryMb: 96, nanoCpus: 300000000 },
        timeouts: { runMs: 2000 }
    },
    // 2. PYTHON
    python: {
        image: 'python:3.9-slim',
        fileName: 'main.py',
        compileCmd: null,
        runCmd: ['python', 'main.py'],
        limits: { memoryMb: 160, nanoCpus: 600000000 },
        timeouts: { runMs: 2500 }
    },
    // 3. C/C++ (GCC) - using slim debian image for smaller size and stability
    cpp: {
        image: 'gcc:13',
        fileName: 'main.cpp',
        compileCmd: ['g++', '-o', 'run_app', 'main.cpp'],
        runCmd: ['./run_app'],
        limits: { memoryMb: 256, nanoCpus: 1000000000, pidsLimit: 128, tmpfsMb: 64 },
        timeouts: { compileMs: 25000, runMs: 2000 }
    },
    c: {
        image: 'gcc:13',
        fileName: 'main.c',
        compileCmd: ['gcc', '-o', 'run_app', 'main.c'],
        runCmd: ['./run_app'],
        limits: { memoryMb: 256, nanoCpus: 1000000000, pidsLimit: 128, tmpfsMb: 64 },
        timeouts: { compileMs: 20000, runMs: 2000 }
    },
    // 4. JAVA
    java: {
        image: 'eclipse-temurin:17-jdk-alpine',
        fileName: 'Main.java',
        compileCmd: ['javac', 'Main.java'],
        runCmd: ['java', 'Main'],
        limits: { memoryMb: 384, nanoCpus: 1200000000, pidsLimit: 128, tmpfsMb: 96 },
        timeouts: { compileMs: 25000, runMs: 4000 }
    },
    // 5. PHP
    php: {
        image: 'php:8.2-cli-alpine',
        fileName: 'main.php',
        compileCmd: null,
        runCmd: ['php', 'main.php'],
        limits: { memoryMb: 96, nanoCpus: 300000000 },
        timeouts: { runMs: 2000 }
    },
    // 6. RUST
    rust: {
        image: 'rust:alpine',
        fileName: 'main.rs',
        compileCmd: ['rustc', 'main.rs', '-o', 'run_app'],
        runCmd: ['./run_app'],
        limits: { memoryMb: 256, nanoCpus: 1000000000, pidsLimit: 128, tmpfsMb: 64 },
        timeouts: { compileMs: 30000, runMs: 2500 }
    },
    // 7. GOLANG
    go: {
        image: 'golang:1.21-alpine',
        fileName: 'main.go',
        // important: disable Go Modules for simple single file execution
        compileCmd: ['sh', '-c', 'export GO111MODULE=off && go build -o run_app main.go'],
        runCmd: ['./run_app'],
        limits: { memoryMb: 256, nanoCpus: 1000000000, pidsLimit: 128, tmpfsMb: 64 },
        timeouts: { compileMs: 30000, runMs: 2500 }
    },
    // 9. C# (.NET 8)
    csharp: {
        image: 'mcr.microsoft.com/dotnet/sdk:8.0-alpine', // SDK is needed for build
        fileName: 'Program.cs',
        // hack: create .csproj on the fly, otherwise dotnet build won't understand what to do with the file
        compileCmd: ['sh', '-c', 'echo \'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable></PropertyGroup></Project>\' > Program.csproj && dotnet build -o out'],
        runCmd: ['dotnet', './out/Program.dll'],
        limits: { memoryMb: 384, nanoCpus: 1200000000, pidsLimit: 128, tmpfsMb: 96 },
        timeouts: { compileMs: 30000, runMs: 4000 }
    }
};


// --- HELPERS ---

function packStringAsTar(fileName, fileContent) {
    const pack = tar.pack();
    // important: file name without folders
    pack.entry({ name: fileName }, fileContent);
    pack.finalize();
    return pack;
}

async function ensureImage(imageName) {
    try {
        const image = docker.getImage(imageName);
        await image.inspect();
    } catch (e) {
        if (e.statusCode === 404) {
            console.log(`[INFO] Downloading image ${imageName}...`);
            const stream = await docker.pull(imageName);
            await new Promise((resolve, reject) => {
                docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
            });
            console.log(`[INFO] Image downloaded.`);
        } else {
            throw e;
        }
    }
}

async function execCommand(container, cmd, inputString = '', timeLimitMs = 0) {
    const exec = await container.exec({
        Cmd: cmd,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false
    });

    const stream = await exec.start({ hijack: true, stdin: true });

    const executionPromise = new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        container.modem.demuxStream(stream, {
            write: (chunk) => { stdout += chunk.toString('utf8'); }
        }, {
            write: (chunk) => { stderr += chunk.toString('utf8'); }
        });

        if (inputString) stream.write(inputString);
        stream.end();

        stream.on('end', async () => {
            try {
                const inspect = await exec.inspect();
                resolve({
                    exitCode: inspect.ExitCode,
                    stdout: stdout,
                    stderr: stderr,
                    isTimeout: false
                });
            } catch (err) { reject(err); }
        });
    });

    if (timeLimitMs <= 0) return executionPromise;

    let timeoutId;
    const timeoutPromise = new Promise((resolve) => {
        timeoutId = setTimeout(() => {
            resolve({ isTimeout: true });
        }, timeLimitMs);
    });

    const result = await Promise.race([executionPromise, timeoutPromise]);

    if (result.isTimeout) {
        stream.destroy(); 
        return { exitCode: 124, stdout: '', stderr: 'Time Limit Exceeded', isTimeout: true };
    }

    clearTimeout(timeoutId);
    return result;
}


// --- MAIN FUNCTIONS ---

async function createRunner(lang) {
    if (!LANGUAGES[lang]) throw new Error(`Lang ${lang} not supported`);
    const config = LANGUAGES[lang];

    await ensureImage(config.image);

    const limits = mergeLimits(config.limits);
    const hostConfig = buildHostConfig(limits);

    const container = await docker.createContainer({
        Image: config.image,
        Cmd: ['sleep', 'infinity'], 
        WorkingDir: '/app',
        NetworkDisabled: true,
        HostConfig: hostConfig
    });

    await container.start();
    return container.id;
}

async function runCode(containerId, lang, code, inputData = "", customRunTimeLimitMs) {
    const container = docker.getContainer(containerId);
    const config = LANGUAGES[lang];
    const timeouts = mergeTimeouts(config.timeouts);
    const finalize = async (result) => {
        await cleanupContainerProcesses(container);
        return result;
    };

    // 1. load code
    const tarStream = packStringAsTar(config.fileName, code);
    
    // important: explicitly specify destination path
    try {
        await container.putArchive(tarStream, { path: '/app' });
    } catch (e) {
        console.error("File upload error:", e);
        return finalize({ status: 'system_error', output: 'Failed to upload code' });
    }

    // 2. compilation
    if (config.compileCmd) {
        const compileTimeout = typeof timeouts.compileMs === 'number'
            ? timeouts.compileMs
            : DEFAULT_TIMEOUTS.compileMs;
        const compileRes = await execCommand(container, config.compileCmd, '', compileTimeout);
        if (compileRes.isTimeout) {
            return finalize({ status: 'compilation_timeout', output: 'Compilation timed out' });
        }
        if (compileRes.exitCode !== 0) {
            return finalize({ status: 'compilation_error', output: compileRes.stderr || compileRes.stdout });
        }
    }

    // 3. execution
    const runTimeout = typeof customRunTimeLimitMs === 'number'
        ? customRunTimeLimitMs
        : timeouts.runMs;
    const runRes = await execCommand(container, config.runCmd, inputData, runTimeout);

    if (runRes.isTimeout) {
        return finalize({ status: 'timeout', output: 'Time Limit Exceeded' });
    }

    return finalize({
        status: runRes.exitCode === 0 ? 'success' : 'runtime_error',
        output: runRes.stdout,
        error: runRes.stderr
    });
}

async function stopRunner(containerId) {
    if (!containerId) return;
    const container = docker.getContainer(containerId);
    try {
        await container.remove({ force: true });
    } catch (e) { /* ignore */ }
}

module.exports = { createRunner, runCode, stopRunner };