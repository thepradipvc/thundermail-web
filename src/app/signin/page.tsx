import SigninForm from "./_SigninForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = async () => {
  return (
    <main className="grid min-h-svh place-items-center">
      <Card className="mx-4 bg-zinc-950 px-2 sm:p-10">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SigninForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;
