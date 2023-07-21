import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "@/lib/data/firebase";
import { publicPaths } from "@/components/RouteGuard/publicPaths";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, isUserLoading] = useAuthState(firebaseAuth);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router.asPath, router.events, isUserLoading, authCheck]);

  function authCheck(url: string) {
    const path = url.split("?")[0];
    if (publicPaths.includes(path)) {
      setAuthorized(true);
    } else {
      if (!isUserLoading && !user) {
        setAuthorized(false);
        void router.push({
          pathname: "/login",
          query: { returnUrl: router.asPath },
        });
      } else {
        setAuthorized(true);
      }
    }
  }

  return authorized ? <>{children}</> : null;
}
