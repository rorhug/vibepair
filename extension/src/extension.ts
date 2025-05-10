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
import * as vsls from "vsls";

class SampleTreeItem extends vscode.TreeItem {
  id?: string;
  offerId?: string;
  bidId?: string;
  isBid?: boolean;
  constructor(
    label: string,
    collapsibleState?: vscode.TreeItemCollapsibleState,
    id?: string,
    offerId?: string,
    bidId?: string,
    isBid?: boolean
  ) {
    super(label, collapsibleState);
    this.id = id;
    this.offerId = offerId;
    this.bidId = bidId;
    this.isBid = isBid;
    if (isBid && bidId && offerId) {
      this.contextValue = "bidItem";
    }
  }
}

class SampleTreeDataProvider
  implements vscode.TreeDataProvider<SampleTreeItem>
{
  private username: string | undefined;
  private isAuthenticated: boolean = false;
  private _onDidChangeTreeData: vscode.EventEmitter<
    SampleTreeItem | undefined | void
  > = new vscode.EventEmitter<SampleTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SampleTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  constructor(username?: string) {
    if (username) {
      this.username = username;
      this.isAuthenticated = true;
    }
  }

  refresh(element?: SampleTreeItem): void {
    this._onDidChangeTreeData.fire(element);
  }

  getTreeItem(element: SampleTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: SampleTreeItem): Promise<SampleTreeItem[]> {
    if (!element) {
      // Fetch all offers from Supabase
      try {
        const { data, error } = await supabase
          .from("offer")
          .select("id, description, username, price, accepted_bid");
        if (error) {
          vscode.window.showErrorMessage(
            `Failed to fetch offers: ${error.message}`
          );
          return [];
        }
        if (!data) return [];
        return data.map(
          (offer: {
            id: string;
            description: string;
            username: string;
            price: number;
            accepted_bid: string | null;
          }) => {
            const item = new SampleTreeItem(
              offer.description,
              vscode.TreeItemCollapsibleState.Collapsed,
              offer.id
            );
            item.description = `${offer.username} - $${offer.price}`;
            return item;
          }
        );
      } catch (e: any) {
        vscode.window.showErrorMessage(`Error fetching offers: ${e.message}`);
        return [];
      }
    } else if (element.id) {
      // Fetch bids for the offer
      try {
        const { data, error } = await supabase
          .from("bids")
          .select("id, username, price")
          .eq("offer_id", element.id);
        if (error) {
          vscode.window.showErrorMessage(
            `Failed to fetch bids: ${error.message}`
          );
          return [];
        }
        if (!data || data.length === 0) {
          return [new SampleTreeItem("No bids yet")];
        }
        return data.map(
          (bid: { id: string; username: string; price: number }) => {
            const item = new SampleTreeItem(
              `${bid.username} - $${bid.price}`,
              vscode.TreeItemCollapsibleState.None,
              undefined,
              element.id,
              bid.id,
              true
            );
            item.description = undefined;
            return item;
          }
        );
      } catch (e: any) {
        vscode.window.showErrorMessage(`Error fetching bids: ${e.message}`);
        return [];
      }
    }
    return [];
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
  let treeDataProvider: SampleTreeDataProvider | undefined;
  function registerTreeViewProvider() {
    treeDataProvider = new SampleTreeDataProvider(username);
    context.subscriptions.push(
      vscode.window.registerTreeDataProvider(
        "vibepair-treeView",
        treeDataProvider
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

  // Register Accept Bid command
  const disposableAcceptBid = vscode.commands.registerCommand(
    "vibepair.acceptBid",
    async (item: SampleTreeItem) => {
      if (!item || !item.isBid || !item.offerId || !item.bidId) {
        vscode.window.showErrorMessage("Invalid bid selection.");
        return;
      }
      // Set accepted_bid on offer
      const { error: updateError } = await supabase
        .from("offer")
        .update({ accepted_bid: item.bidId })
        .eq("id", item.offerId);
      if (updateError) {
        vscode.window.showErrorMessage(
          `Failed to accept bid: ${updateError.message}`
        );
        return;
      }
      // Start Live Share session
      const liveshare = await vsls.getApi();
      if (!liveshare) {
        vscode.window.showErrorMessage(
          "VS Live Share extension is not available."
        );
        return;
      }
      const session = await liveshare.share();
      if (!session || !liveshare.session || !liveshare.session.id) {
        vscode.window.showErrorMessage("Failed to start Live Share session.");
        return;
      }
      // Compose the Live Share link
      const liveshareLink = `https://prod.liveshare.vsengsaas.visualstudio.com/join?${liveshare.session.id}`;
      // Update offer with liveshare_link
      const { error: linkError } = await supabase
        .from("offer")
        .update({ liveshare_link: liveshareLink })
        .eq("id", item.offerId);
      if (linkError) {
        vscode.window.showErrorMessage(
          `Failed to update offer with Live Share link: ${linkError.message}`
        );
        return;
      }
      vscode.window.showInformationMessage(
        `Bid accepted! Live Share started: ${liveshareLink}`
      );
    }
  );
  context.subscriptions.push(disposableAcceptBid);

  // Refresh bids when an offer is expanded
  vscode.window
    .createTreeView("vibepair-treeView", {
      treeDataProvider: treeDataProvider!,
    })
    .onDidExpandElement((e) => {
      if (
        treeDataProvider &&
        e.element instanceof SampleTreeItem &&
        e.element.id
      ) {
        treeDataProvider.refresh(e.element);
      }
    });
}

// This method is called when your extension is deactivated
export function deactivate() {}
