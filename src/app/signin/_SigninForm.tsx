"use client";

import { useState } from "react";
import { Icons } from "../../components/Icons";
import { Button } from "../../components/ui/button";
import Link from "next/link";

const SigninForm = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <Button
      onClick={() => setIsSigningIn(true)}
      size="lg"
      variant="outline"
      className="justify-start"
      asChild
    >
      <Link href="/api/auth/google">
        {isSigningIn ? (
          <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-6 w-6" />
        )}
        Sign In with Google
      </Link>
    </Button>
  );
};

export default SigninForm;
