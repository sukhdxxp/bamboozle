import React from "react";
import UserDropdown from "@/components/UserDropdown";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/lib/data/firebase";

export default function Header() {
  const [user] = useAuthState(firebaseAuth);
  const welcomeText = user ? `Welcome, ${user.displayName}` : "Welcome User";
  return (
    <div className={"flex px-4 pt-4 justify-center items-center select-none"}>
      <div
        className={
          "flex-1 first-letter:text-lg text-md text-slate-700 font-light"
        }
      >
        {welcomeText}
      </div>
      <UserDropdown />
    </div>
  );
}
