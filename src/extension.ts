import * as vscode from 'vscode';
import {spawn, ChildProcess, SpawnOptions} from 'child_process'

function waitProcessToEnd(
	childProcess: ChildProcess
) {
	return new Promise((res, rej) => {

        childProcess.stdout?.setEncoding('utf8');
        childProcess.stdout?.on('data', (stdout) => {
            console.log(`Child Output: ${stdout}`);
        });

        childProcess.stderr?.setEncoding('utf8');
        childProcess.stderr?.on('data', (stderr) => {
            console.error(`Child Error: ${stderr.toString()}`);
        });
		
		childProcess.on('close', (exitCode) => {
            console.log(`Child exited with error exit code: ${exitCode}`);
			return res(exitCode);
		});

		childProcess.on('error', (error) => {
			console.log(`Recording reported an error:\n ${error.message}`);
			return rej();
		});
	});
}

function getExtensionAbsPath(): string {
	const extensionId = 'vscode-samples.helloworld-sample';
	const extensionAbsPath = vscode.extensions.getExtension(
		extensionId,
	)?.extensionPath;
	if (extensionAbsPath === undefined) {
		const message = `Could not find extensionPath by extension ID: "${extensionId}"`;
		const error = new Error(message);
		console.error(error, message);
		throw error;
	}
	return extensionAbsPath;
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "helloworld-sample" is now active!');

	const disposable = vscode.commands.registerCommand('extension.helloWorld', async () => {
		vscode.window.showInformationMessage('Hello World!');

		const extensionRootAbsPath = getExtensionAbsPath();
		const options: SpawnOptions = {
			cwd: extensionRootAbsPath,
			stdio: ['pipe', 'pipe', 'pipe'],
		};

		const argsForAttachToNodeChildDebugger = ['--inspect-brk=127.0.0.1:9234', './out/child.js', ];
		const normalArgs = ['./out/child.js', ];

		console.log('Starting child process');
		const childProcess = spawn(
			'node',
			// argsForAttachToNodeChildDebugger, 	// 1) With this the "Attach to Node Child" debugger stops to child breakpoints after the "Attach to Node Child" debugger has been started manually
			normalArgs,								// 2) With this debugger does not stop for child breakpoints
			options);
		await waitProcessToEnd(childProcess);
		console.log('Child process done. Parent exiting');
	});

	context.subscriptions.push(disposable);
}
