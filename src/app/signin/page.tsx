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
    <main className="min-h-svh grid place-items-center">
      <Card className="mx-4 px-2 sm:p-10">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Welcome</CardTitle>
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
