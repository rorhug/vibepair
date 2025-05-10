// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

class SampleTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState?: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }
}

class SampleTreeDataProvider
  implements vscode.TreeDataProvider<SampleTreeItem>
{
  getTreeItem(element: SampleTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SampleTreeItem): Thenable<SampleTreeItem[]> {
    if (!element) {
      // Root items
      return Promise.resolve([
        new SampleTreeItem("Item 1"),
        new SampleTreeItem("Item 2", vscode.TreeItemCollapsibleState.Collapsed),
        new SampleTreeItem("Item 3"),
      ]);
    } else if (element.label === "Item 2") {
      // Children of Item 2
      return Promise.resolve([
        new SampleTreeItem("Subitem 2.1"),
        new SampleTreeItem("Subitem 2.2"),
      ]);
    }
    return Promise.resolve([]);
  }

  onDidChangeTreeData?: vscode.Event<SampleTreeItem | undefined | void>;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "tf-vsc" is now active yo yo asdf!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "tf-vsc.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from talent-finder!");
    }
  );

  const sampleTreeDataProvider = new SampleTreeDataProvider();
  vscode.window.registerTreeDataProvider(
    "tf-vsc-sampleView",
    sampleTreeDataProvider
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
