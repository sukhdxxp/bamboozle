"use client";

import React, { ReactEventHandler, useRef } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/lib/data/firebase";
import { useOutsideClickHandler } from "@/hooks/useOutsideClickHandler";
import { BiLogIn } from "react-icons/bi";
import UserAvatar from "@/components/UserAvatar";

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
      void signInWithPopup(firebaseAuth, googleProvider);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    void signOut(firebaseAuth);
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
      <UserAvatar
        src={imageUrl}
        fullName={user.displayName}
        onClick={handleDropdownToggle}
      />
      <div
        id="userDropdown"
        className={`absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ${dropdownClass}`}
      >
        <div className="px-4 py-3 text-sm text-gray-900">
          <div>{user.displayName}</div>
          <div className="font-medium truncate">{user.email}</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="avatarButton"
        >
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Profile
            </a>
          </li>
          <li>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Settings
            </a>
          </li>
        </ul>
        <div className="py-1">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}
