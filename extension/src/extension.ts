// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Credentials } from "./creds";

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
  private username: string | undefined;
  private isAuthenticated: boolean = false;

  constructor(username?: string) {
    if (username) {
      this.username = username;
      this.isAuthenticated = true;
    }
  }

  getTreeItem(element: SampleTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SampleTreeItem): Thenable<SampleTreeItem[]> {
    if (!element) {
      // Root items
      const items: SampleTreeItem[] = [];
      if (this.isAuthenticated && this.username) {
        items.push(new SampleTreeItem(`Signed in as ${this.username}`));
      }
      items.push(
        new SampleTreeItem("Item 1"),
        new SampleTreeItem("Item 2", vscode.TreeItemCollapsibleState.Collapsed),
        new SampleTreeItem("Item 3")
      );
      return Promise.resolve(items);
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

class WelcomeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vibepair-welcomeView";
  constructor(private readonly context: vscode.ExtensionContext) {}
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.html = this.getHtml();
  }
  private getHtml(): string {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;">
        <h2>Welcome to VibePair!</h2>
        <p>Get started by signing in with GitHub.</p>
      </div>
    `;
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vibepair" is now active yo yo asdf!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable1 = vscode.commands.registerCommand(
    "vibepair.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from VibePair!");
    }
  );

  const credentials = new Credentials();
  await credentials.initialize(context);

  // Check authentication status and get username
  let isAuthenticated = false;
  let username: string | undefined = undefined;
  try {
    const session = await vscode.authentication.getSession(
      "github",
      ["user:email"],
      { createIfNone: false }
    );
    isAuthenticated = !!session;
    if (isAuthenticated) {
      const octokit = await credentials.getOctokit();
      const userInfo = await octokit.users.getAuthenticated();
      username = userInfo.data.login;
    }
  } catch (e) {
    isAuthenticated = false;
    username = undefined;
  }
  await vscode.commands.executeCommand(
    "setContext",
    "vibepair:isAuthenticated",
    isAuthenticated
  );

  // Register tree view provider with username
  const sampleTreeDataProvider = new SampleTreeDataProvider(username);
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      "vibepair-treeView",
      sampleTreeDataProvider
    )
  );

  // Register welcome view provider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      WelcomeViewProvider.viewType,
      new WelcomeViewProvider(context)
    )
  );

  // Listen for auth changes to update context
  vscode.authentication.onDidChangeSessions(async (e) => {
    if (e.provider.id === "github") {
      let authed = false;
      try {
        const session = await vscode.authentication.getSession(
          "github",
          ["user:email"],
          { createIfNone: false }
        );
        authed = !!session;
      } catch (e) {
        authed = false;
      }
      await vscode.commands.executeCommand(
        "setContext",
        "vibepair:isAuthenticated",
        authed
      );
    }
  });

  const disposable2 = vscode.commands.registerCommand(
    "extension.getGitHubUser",
    async () => {
      /**
       * Octokit (https://github.com/octokit/rest.js#readme) is a library for making REST API
       * calls to GitHub. It provides convenient typings that can be helpful for using the API.
       *
       * Documentation on GitHub's REST API can be found here: https://docs.github.com/en/rest
       */
      const octokit = await credentials.getOctokit();
      const userInfo = await octokit.users.getAuthenticated();

      vscode.window.showInformationMessage(
        `Logged into GitHub as ${userInfo.data.login}`
      );
    }
  );

  context.subscriptions.push(disposable1, disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
