## code-runner

Small Docker-based sandbox for running interview-style code snippets across multiple languages with consistent limits and reporting.

### Features
- runs JS, Python, C/C++, Java, Go, PHP, Rust, and C# via Docker images
- per-language resource limits (memory/CPU/pids/tmpfs, no-new-privileges, dropped caps)
- compile/run timeout tiers, overridable per invocation
- post-run cleanup script kills leftover processes inside the container
- test harness (`test.js`) to verify runner health across languages

### Requirements
- Docker with access to `/var/run/docker.sock`
- Node.js 18+ (for running the controller scripts)

### Install
```bash
npm install
```

### Local test run
```bash
# lint/compile steps are not required; just run the test harness
node test.js
```

### Docker workflow
Build an image that bundles the runner and test harness (see `Dockerfile`):
```bash
docker build -t my-runner .
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock my-runner
```

### Runner API
- `createRunner(lang)`  
  pulls image if necessary, creates a sleeping sandbox container with the configured resource limits.
- `runCode(containerId, lang, code, input, [runTimeoutMs])`  
  uploads the snippet, runs optional compile command, then executes with stdin data and timeouts.
- `stopRunner(containerId)`  
  force-removes the sandbox; always call when finished.

See `runner.js` for language definitions (`LANGUAGES`). Each entry controls:
- `image`: Docker base image
- `fileName`: source name inside `/app`
- `compileCmd` / `runCmd`
- `limits`: overrides for memory, CPU, PID cap, tmpfs size, etc.
- `timeouts`: per-language compile/run budgets (ms)

### Customization tips
- add new languages by extending `LANGUAGES`
- tweak resource or timeout defaults via `DEFAULT_LIMITS` and `DEFAULT_TIMEOUTS`
- integrate your own judge by importing `createRunner`, `runCode`, and `stopRunner` in a custom service

### Security considerations
- containers run with networking disabled, no-new-privileges, reduced capabilities
- tmpfs can be enabled per language for ephemeral `/tmp`
- cleanup script ensures background processes die between runs
- for stricter policies, add seccomp/apparmor profiles or additional static analysis before execution

