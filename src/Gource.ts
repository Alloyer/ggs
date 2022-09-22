import * as vscode from "vscode";
import { GourceStatus, StatusBar } from "./StatusBar";

export class Gource {
	private static gourceInstance: Gource;
	private static statusBar: StatusBar;

	public static launch(context: vscode.ExtensionContext): void {
		const statusBar = context.globalState.get<StatusBar>("statusBar");

		if (!statusBar) {
			throw new Error("No statusBar is created!");
		}

		let currentStatus = statusBar.status;
		if (currentStatus === GourceStatus.Success) {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				throw new Error(
					"ALERT! Gource status = Success, but there is no workspaceFolders!"
				);
			}

			const path = require("path");
			const workspacePath = workspaceFolders[0].uri.fsPath;
			const extensionPath = context.extensionPath;
			const gourcePath = path.resolve(
				extensionPath,
				"src/gource-0.53.win64/gource.exe"
			);

			const { execFile } = require("node:child_process");

			execFile(
				gourcePath,
				["-r", "60", "--highlight-users", workspacePath], //'--max-files', '2000', 'C:/ado/src'],//
				function (err: any, data: any) {
					if (err) {
						console.log(err);
					} else {
						console.log("Seems OK!");
						if (data) {
							console.log("Seemd we have DATA");
						}
					}
				}
			);
		} else {
			console.log(
				`Gource status is NOT Success, current status = ${currentStatus}`
			);
		}
	}
}
