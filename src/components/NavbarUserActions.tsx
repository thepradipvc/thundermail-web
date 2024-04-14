import Link from "next/link";
import { Button } from "./ui/button";
import { validateUser } from "@/auth";

const NavbarUserActions = async () => {
  const { user } = await validateUser();

  if (!user) {
    return (
      <Button asChild>
        <Link href="/signin">Sign in</Link>
      </Button>
    );
  }

  return (
    <Button asChild>
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
};

export default NavbarUserActions;
