"use client";

import React, { useRef } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/lib/data/firebase";
import { useOutsideClickHandler } from "@/hooks/useOutsideClickHandler";
import { BiLogIn } from "react-icons/bi";

export default function UserDropdown() {
  const [user] = useAuthState(firebaseAuth);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const googleProvider = new GoogleAuthProvider();

  const dropdownWrapperRef = useRef(null);
  useOutsideClickHandler(dropdownWrapperRef, () => {
    setIsDropdownOpen(false);
  });

  const handleLogin = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut(firebaseAuth);
  };

  if (!user) {
    return (
      <BiLogIn className={"w-8 h-8 cursor-pointer"} onClick={handleLogin} />
    );
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dropdownClass = isDropdownOpen ? "block" : "hidden";

  const imageUrl = user.photoURL ?? "";
  return (
    <div className="relative" ref={dropdownWrapperRef}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        id="avatarButton"
        data-dropdown-toggle="userDropdown"
        data-dropdown-placement="bottom-start"
        className="w-10 h-10 rounded-full cursor-pointer ml-auto"
        src={imageUrl}
        alt="User dropdown"
        onClick={handleDropdownToggle}
      />
      <div
        id="userDropdown"
        className={`absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 ${dropdownClass}`}
      >
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div>{user.displayName}</div>
          <div className="font-medium truncate">{user.email}</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="avatarButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
        </ul>
        <div className="py-1">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            onClick={handleLogout}
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}
