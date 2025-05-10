import Link from "next/link";
import { Button } from "./ui/button";

export default function DeployButton() {
  return (
    <>
      <Link
        href="https://marketplace.visualstudio.com/items?itemName=bei.vibepair"
        target="_blank"
      >
        <Button className="flex items-center gap-2" size={"sm"}>
          <img src="/vscode-alt.svg" alt="VSCode" className="w-4 h-4" />
          <span>Download for VSCode</span>
        </Button>
      </Link>
    </>
  );
}
