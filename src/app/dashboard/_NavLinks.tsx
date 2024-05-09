"use client";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdHome } from "react-icons/io";
import { MdOutlineEmail, MdOutlineManageAccounts } from "react-icons/md";

const links = [
  { name: "Overview", href: "/dashboard", icon: IoMdHome },
  {
    name: "Email Accounts",
    href: "/dashboard/email-accounts",
    icon: MdOutlineManageAccounts,
  },
  { name: "Emails", href: "/dashboard/emails", icon: MdOutlineEmail },
  { name: "API Keys", href: "/dashboard/api-keys", icon: Lock },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-[#bdc8ff17] hover:text-white",
              {
                "bg-[#bdc8ff17] text-white": link.href === pathname,
              },
            )}
          >
            <LinkIcon className="h-4 w-4" />
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
