import { signout } from "@/auth/signout";
import SignoutButton from "@/components/SignoutButton";

const page = () => {
  return (
    <main className="flex h-full flex-col items-center p-24">
      <h1 className="text-5xl mb-20">Coming Soon</h1>

      <SignoutButton signout={signout} />
    </main>
  );
};

export default page;
