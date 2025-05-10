import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex flex-col gap-2 mt-8">
        <SubmitButton pendingText="Redirecting..." formAction={signInAction}>
          Sign in with GitHub
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
