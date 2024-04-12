import Link from "next/link";
import NavLinks from "./_NavLinks";
import Image from "next/image";
import SignoutButton from "@/components/SignoutButton";
import { signout } from "@/auth/signout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="min-w-56 border-r border-r-gray-800 px-2">
        <SideNav />
      </div>
      <div className="min-w-fit flex-grow overflow-y-auto p-6">{children}</div>
    </div>
  );
}

function SideNav() {
  return (
    <div className="flex h-full flex-col gap-8 px-2 py-4">
      <Link className="overflow-hidden rounded-md" href="/">
        <Image
          src="/gmailit.svg"
          alt="Gmailit logo"
          width={120}
          height={25}
          priority
        />
      </Link>
      <div className="mt-8 flex grow flex-col justify-between">
        <div className="space-y-2">
          <NavLinks />
        </div>
        <SignoutButton signout={signout} />
      </div>
    </div>
  );
}
