import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import NavbarUserActions from "./NavbarUserActions";

export default function Navbar() {
  return (
    <header>
      <MaxWidthWrapper>
        <nav className="mt-4 flex items-center justify-between rounded-md border-2 border-gray-800 p-4 lg:px-6">
          <Link href="/" className="overflow-hidden rounded-md">
            <Image
              src="/gmailit.svg"
              alt="Gmailit logo"
              width={120}
              height={25}
              priority
            />
          </Link>

          <Suspense fallback={<Skeleton className="h-9 w-24 rounded-md" />}>
            <NavbarUserActions />
          </Suspense>
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}
