import { StatusBarAlignment, StatusBarItem, window, workspace } from "vscode";

export enum GourceStatus {
	Ready = "check-all",
	Success = "check",
	Ignore = "x",
	Warn = "warning",
	Error = "alert",
	Disabled = "circle-slash",
}

export class StatusBar {
	private statusBarItem: StatusBarItem;
	public readonly status: GourceStatus;

	constructor() {
		// Setup the statusBarItem
		this.statusBarItem = window.createStatusBarItem(
			"ggs.status",
			StatusBarAlignment.Right,
			-1
		);
		this.statusBarItem.name = "Gource";
		this.statusBarItem.text = "Gource";

		let workspaceFolders = workspace.workspaceFolders;
		let warnMessage;

		if (workspaceFolders) {
			if (workspaceFolders.length === 1) {
				//Take root folder of first of workspaces and look for .git there
				let firstWorkspace = workspaceFolders[0];

				const fs = require("fs");
				const path = require("path");

				const gitFolderName = path.resolve(firstWorkspace.uri.fsPath, ".git");
				if (!fs.existsSync(gitFolderName)) {
					//No .git folder was found in the root directory of current worksapce
					warnMessage =
						"No .git folder exists in the current workspace root folder!";
				}
			} else if (workspaceFolders.length > 1) {
				//Currently not supporting multiple workspaces
				warnMessage =
					"More than one worksapce is opened! We do not support more than 1 workspace yet!";
			} else {
				//There is no opened workspaces
				warnMessage = "There is no opened workspaces!";
			}
		}

		if (!warnMessage) {
			this.status = GourceStatus.Success;
		} else {
			this.status = GourceStatus.Warn;
			console.log(warnMessage);
		}

		this.update(this.status);
	}

	public update(result: GourceStatus): void {
		this.statusBarItem.text = `$(${result.toString()}) Gource`;
		this.statusBarItem.show();
	}

	public hide() {
		this.statusBarItem.hide();
	}
}
