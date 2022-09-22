// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Gource } from "./Gource";
import { StatusBar } from "./StatusBar";

export function activate(context: vscode.ExtensionContext) {
	const statusBar = new StatusBar();

	context.globalState.setKeysForSync(["statusBar"]);
	context.globalState.update("statusBar", statusBar);

	const showGourceSettingsDialogCommand = vscode.commands.registerCommand(
		"ggs.show",
		() => launchGource(context)
	);

	context.subscriptions.push(showGourceSettingsDialogCommand);

	vscode.commands.executeCommand("setContext", "ggs.showGourseIsVisible", true);
}

export function launchGource(context: vscode.ExtensionContext): void {
	try {
		Gource.launch(context);
		console.log("SUCCESS");
	} catch (error) {
		console.log("ERROR: " + error);
	}
}
