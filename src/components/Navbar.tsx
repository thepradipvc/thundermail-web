import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Icons } from "./Icons";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 container">
      <Link href="/" className="rounded-lg overflow-hidden">
        <Image
          src="/gmailit.svg"
          alt="Gmailit logo"
          width={180}
          height={37}
          priority
        />
      </Link>
      <nav>
        <Button asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      </nav>
    </header>
  );
}
