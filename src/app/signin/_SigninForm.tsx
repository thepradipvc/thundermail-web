"use client";

import { useState } from "react";
import { Icons } from "../../components/Icons";
import { Button } from "../../components/ui/button";
import Link from "next/link";

const SigninForm = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsSigningIn(true)}
        size="lg"
        variant="outline"
        className="justify-start"
        asChild
      >
        <Link href="/api/auth/google">
          {isSigningIn ? (
            <Icons.spinner className="w-6 h-6 mr-2 animate-spin" />
          ) : (
            <Icons.google className="h-6 w-6 mr-2" />
          )}
          Sign In with Google
        </Link>
      </Button>
    </>
  );
};

export default SigninForm;
