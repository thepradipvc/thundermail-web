import { signout } from "@/auth/signout";
import SignoutButton from "@/components/SignoutButton";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <main className="flex h-full flex-col items-center">
      <h1 className="mb-20 text-5xl">Coming Soon</h1>
      <SignoutButton signout={signout} />
    </main>
  );
};
export default page;
