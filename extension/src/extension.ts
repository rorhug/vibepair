// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Credentials } from "./creds";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase/types";
import supabase from "./supabase/client";

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

  function registerTreeViewProvider() {
    const sampleTreeDataProvider = new SampleTreeDataProvider(username);
    context.subscriptions.push(
      vscode.window.registerTreeDataProvider(
        "vibepair-treeView",
        sampleTreeDataProvider
      )
    );
  }

  if (isAuthenticated) {
    registerTreeViewProvider();
  }

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
      if (authed) {
        registerTreeViewProvider();
      }
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

  const disposableSignOut = vscode.commands.registerCommand(
    "vibepair.signOut",
    async () => {
      try {
        await vscode.authentication.getSession("github", ["user:email"], {
          clearSessionPreference: true,
        });
        vscode.window.showInformationMessage("Signed out of GitHub.");
        await vscode.commands.executeCommand(
          "setContext",
          "vibepair:isAuthenticated",
          false
        );
      } catch (e) {
        vscode.window.showErrorMessage("Failed to sign out of GitHub.");
      }
    }
  );

  // New: GitHub login command
  const disposableLogin = vscode.commands.registerCommand(
    "vibepair.loginToGitHub",
    async () => {
      try {
        const session = await vscode.authentication.getSession(
          "github",
          ["user:email"],
          { createIfNone: true }
        );
        if (session) {
          vscode.window.showInformationMessage("Signed in to GitHub!");
          await vscode.commands.executeCommand(
            "setContext",
            "vibepair:isAuthenticated",
            true
          );
          // Optionally, refresh the tree view
          // registerTreeViewProvider();
        }
      } catch (e) {
        vscode.window.showErrorMessage("GitHub sign-in cancelled or failed.");
      }
    }
  );

  context.subscriptions.push(
    disposable1,
    disposable2,
    disposableSignOut,
    disposableLogin
  );

  // --- Create Offer Command ---
  const disposableCreateOffer = vscode.commands.registerCommand(
    "vibepair.createOffer",
    async () => {
      if (!username) {
        vscode.window.showErrorMessage(
          "You must be logged in to create an offer."
        );
        return;
      }
      // const { data: user } = await supabase.auth.signInWithIdToken({

      // });

      // Step 1: Problem Description
      const description = await vscode.window.showInputBox({
        title: "Describe your problem",
        prompt: "What do you need help with?",
        placeHolder: "e.g. Fix the bug in src/app/filename.tsx",
      });
      if (!description) return;

      // Step 2: Expires At (minutes)
      const expiresOptions = [
        { label: "5 minutes", value: 5 },
        { label: "15 minutes", value: 15 },
        { label: "30 minutes", value: 30 },
        { label: "60 minutes", value: 60 },
      ];
      const expiresPick = await vscode.window.showQuickPick(
        expiresOptions.map((o) => o.label),
        {
          title: "How long are you willing to wait?",
          placeHolder: "Select time in minutes",
        }
      );
      if (!expiresPick) return;
      const expires_at =
        expiresOptions.find((o) => o.label === expiresPick)?.value || 15;

      // Step 3: Price
      const priceInput = await vscode.window.showInputBox({
        title: "How much would you pay?",
        prompt: "Enter a dollar amount",
        placeHolder: "e.g. 10",
      });
      if (!priceInput) return;
      const price = parseFloat(priceInput);
      if (isNaN(price)) {
        vscode.window.showErrorMessage("Invalid price entered.");
        return;
      }

      // --- Gather repo, branch, file, terminal ---
      // Repo: try git remote, fallback to folder name
      let repo = path.basename(
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ""
      );
      try {
        const gitRemote = execSync("git remote get-url origin", {
          cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
          encoding: "utf8",
        }).trim();
        repo = gitRemote;
      } catch {}
      // Branch
      let branch = "main";
      try {
        branch = execSync("git rev-parse --abbrev-ref HEAD", {
          cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
          encoding: "utf8",
        }).trim();
      } catch {}
      // Current file
      const activeEditor = vscode.window.activeTextEditor;
      let files: { name: string; content: string }[] = [];
      if (activeEditor) {
        const filePath = vscode.workspace.asRelativePath(
          activeEditor.document.uri
        );
        const content = activeEditor.document.getText();
        files.push({ name: filePath, content });
      }
      // Terminal output (last 100 lines)
      let terminalContent = "";
      try {
        // Try to get from integrated terminal (not directly possible), fallback to shell history
        // This is a workaround: try reading from a known shell history file or skip
        // For demo, just leave blank or add a placeholder
        terminalContent =
          "(last 100 lines of terminal output not available via API)";
      } catch {}
      files.push({ name: "terminal", content: terminalContent });

      // --- Supabase Insert ---

      // const supabaseUrl =
      //   process.env.NEXT_PUBLIC_SUPABASE_URL ||
      //   vscode.workspace.getConfiguration().get<string>("vibepair.supabaseUrl");
      // const supabaseKey =
      //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      //   vscode.workspace
      //     .getConfiguration()
      //     .get<string>("vibepair.supabaseAnonKey");
      // if (!supabaseUrl || !supabaseKey) {
      //   vscode.window.showErrorMessage("Supabase credentials not set.");
      //   return;
      // }
      // const supabase = createClient<Database>(supabaseUrl, supabaseKey);
      // const user_id = username || "unknown";
      const offer: Database["public"]["Tables"]["offer"]["Insert"] = {
        username,
        description,
        expires_at: new Date(Date.now() + expires_at * 60000).toISOString(),
        price,
        repo,
        branch,
        files,
        user_id: "00000000-0000-0000-0000-000000000000",
      };
      const { error } = await supabase.from("offer").insert([offer]);
      if (error) {
        vscode.window.showErrorMessage(
          `Failed to create offer: ${error.message}`
        );
      } else {
        vscode.window.showInformationMessage("Offer created!");
      }
    }
  );
  context.subscriptions.push(disposableCreateOffer);
}

// This method is called when your extension is deactivated
export function deactivate() {}
