# Testing child process debugging with breakpoints

## Running the Sample

- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window
- Add abreakpoint to the `child.ts` file
- In the opened VSCode window press `CTRL + SHIFT + p` to open the command window.
- Type `Hello world` and press `Enter` to launch the child process

- If you use the variable `argsForAttachToNodeChildDebugger` instead of the `normalArgs` in the `extension.ts` file, you can debug the child process by starting the `Attach to Node Child` debugger before the child process is spawned. The child process will stop to the first line of code and wait for the debugger to connect.

## Demo

![demo](demo.gif)
