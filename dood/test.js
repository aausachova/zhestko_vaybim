const { createRunner, runCode, stopRunner } = require('./runner');

const TESTS = [
    // javascript
    {
        name: "JS: Hello",
        lang: "javascript",
        code: `console.log("Hello JS");`,
        input: "",
        expectedStatus: "success"
    },

    // python
    {
        name: "Python: Sum",
        lang: "python",
        code: `
import sys
nums = sys.stdin.read().split()
print(int(nums[0]) + int(nums[1]))
`,
        input: "10 20",
        expectedStatus: "success"
    },

    // c++
    {
        name: "C++: Hello",
        lang: "cpp",
        code: `
#include <iostream>
int main() { std::cout << "Hello C++"; return 0; }
`,
        input: "",
        expectedStatus: "success"
    },

    {
        name: "C++: Compilation Error",
        lang: "cpp",
        code: `
#include <iostream>
int main() {
    std::cout << "Missing semicolon"
    return 0;
}
`,
        input: "",
        expectedStatus: "compilation_error"
    },

    // c
    {
        name: "C: Hello",
        lang: "c",
        code: `
#include <stdio.h>
int main() {
    printf("Hello C");
    return 0;
}
`,
        input: "",
        expectedStatus: "success"
    },
    {
        name: "C: Compilation Error",
        lang: "c",
        code: `
int main() {
    prinf("Typo here");
    return 0;
}
`,
        input: "",
        expectedStatus: "compilation_error"
    },

    // java
    {
        name: "Java: Read Stdin",
        lang: "java",
        // important: class must be named Main (as fileName in config)
        code: `
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String input = scanner.next();
            System.out.print("Java received: " + input);
        }
    }
}
`,
        input: "JavaDuke",
        expectedStatus: "success"
    },

    // go
    {
        name: "Go: Simple Print",
        lang: "go",
        code: `
package main
import "fmt"
func main() {
    fmt.Print("Go is fast")
}
`,
        input: "",
        expectedStatus: "success"
    },
    {
        name: "Go: Compilation Error",
        lang: "go",
        code: `package main; func main() { fmt.Print("Forgot import") }`,
        input: "",
        expectedStatus: "compilation_error"
    },

    // php
    {
        name: "PHP: Echo",
        lang: "php",
        code: `<?php echo "PHP works!";`,
        input: "",
        expectedStatus: "success"
    },

    // rust
    {
        name: "Rust: Hello",
        lang: "rust",
        code: `
fn main() {
    println!("Hello from Rust");
}
`,
        input: "",
        expectedStatus: "success"
    },

    // python runtime error example
    {
        name: "Python: Runtime Error",
        lang: "python",
        code: `
print(1 / 0)
`,
        input: "",
        expectedStatus: "runtime_error"
    }
];

// execution
async function runAllTests() {
    console.log("========== RUNNING FULL TESTING ==========\n");

    // group tests by language to avoid recreating containers unnecessarily
    const testsByLang = {};
    TESTS.forEach(t => {
        if (!testsByLang[t.lang]) testsByLang[t.lang] = [];
        testsByLang[t.lang].push(t);
    });

    for (const lang of Object.keys(testsByLang)) {
        console.log(`>>> Preparing environment for: ${lang.toUpperCase()}`);
        let containerId = null;

        try {
            // 1. create container for language
            containerId = await createRunner(lang);
            console.log(`    Container started: ${containerId.substring(0, 12)}`);

            // 2. run all tests for this language
            for (const test of testsByLang[lang]) {
                console.log(`    ---------------------------------------------------`);
                console.log(`    [TEST] ${test.name}`);
                
                const start = Date.now();
                const result = await runCode(containerId, lang, test.code, test.input);
                const duration = Date.now() - start;

                // analyze result
                const isStatusMatch = result.status === test.expectedStatus;
                const logColor = isStatusMatch ? "\x1b[32m" : "\x1b[31m"; // green or red
                const resetColor = "\x1b[0m";

                console.log(`    Status: ${logColor}${result.status}${resetColor} (Expected: ${test.expectedStatus})`);
                console.log(`    Time:  ${duration}ms`);
                
                if (result.status === 'success') {
                    console.log(`    Output: ${result.output.trim()}`);
                } else {
                    // output error if exists (from stderr or stdout)
                    console.log(`    Error Log: ${ (result.error || result.output || '').trim().substring(0, 100) }...`); 
                }
            }

        } catch (e) {
            console.error(`    CRITICAL ERROR: ${e.message}`);
        } finally {
            // 3. remove container
            if (containerId) {
                await stopRunner(containerId);
                console.log(`    Container stopped.\n`);
            }
        }
    }

    console.log("========== TESTING COMPLETED ==========");
}

runAllTests();