const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runPythonScript(scriptName, args) {
    return new Promise((resolve, reject) => {
        // scriptName: 'histogram.py'
        // args: { input: 'path.csv', x: 'colName', output: 'out.png' ... }

        const scriptPath = path.join(__dirname, '..', '..', 'python_charts', scriptName);

        // Construct CLI args
        const pythonArgs = [scriptPath];
        for (const [key, value] of Object.entries(args)) {
            if (value) {
                pythonArgs.push(`--${key}`);
                pythonArgs.push(value);
            }
        }

        console.log(`Running python: python ${pythonArgs.join(' ')}`);

        // Use 'python' - assume it is in PATH. 
        // If this fails, we might need 'python3' or specific path
        const pythonProcess = spawn('python', pythonArgs);

        let stdoutData = '';
        let stderrData = '';

        pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on('error', (err) => {
            console.error('Failed to start python process:', err);
            reject(new Error(`Failed to start python process: ${err.message}`));
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout: stdoutData, stderr: stderrData });
            } else {
                console.error(`Python Output: ${stdoutData}`);
                console.error(`Python Error: ${stderrData}`);

                // Write to error log file
                fs.writeFileSync(path.join(__dirname, '..', 'python_error.log'),
                    `Time: ${new Date().toISOString()}\nScript: ${scriptName}\nArgs: ${JSON.stringify(args)}\nError: ${stderrData}\nOutput: ${stdoutData}\n\n`,
                    { flag: 'a' }
                );

                reject(new Error(`Python script exited with code ${code}. Stderr: ${stderrData} Args: ${JSON.stringify(pythonArgs)}`));
            }
        });
    });
}

module.exports = { runPythonScript };
