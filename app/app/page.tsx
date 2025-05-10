import Hero from "@/components/hero";
import LandingPageInfo from "@/components/tutorial/landing-page-info";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <LandingPageInfo />
      </main>
    </>
  );
}
