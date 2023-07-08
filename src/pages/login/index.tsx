"use client";

import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/lib/data/firebase";
import { useRouter } from "next/router";

function LoginScreen() {
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();
  const GoogleLogin = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      await router.push("/user");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div>
        <button onClick={GoogleLogin}>
          <FcGoogle /> Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;
