import Hero from "@/components/hero";
import { SubmitButton } from "@/components/submit-button";
import LandingPageInfo from "@/components/tutorial/landing-page-info";
import { signInAction } from "./actions";
import DeployButton from "@/components/deploy-button";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1 className="text-2xl font-medium text-center">
          Help people with their code and get paid $$
        </h1>

        <div className="flex items-center gap-4 justify-center">
          <Button variant="default" onClick={signInAction}>
            Sign in with GitHub
          </Button>
        </div>
      </main>
    </>
  );
}
