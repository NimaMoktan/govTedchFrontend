import { Metadata } from "next";
import SignIn from "./(auth)/signin/page";

export const metadata: Metadata = {
  title:
    "Login | Bhutan Standard Bureau",
  description: "Login page for Bhutan Standard Bureau",
};

export default function Home() {
  return (
    <>
        <SignIn />
    </>
  );
}
