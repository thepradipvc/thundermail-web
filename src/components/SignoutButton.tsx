"use client";
import { Button } from "./ui/button";

const SignoutButton = ({ signout }: { signout: () => void }) => {
  return <Button onClick={() => signout()}>Sign Out</Button>;
};

export default SignoutButton;
