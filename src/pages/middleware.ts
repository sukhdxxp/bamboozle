import { NextRequest, NextResponse } from "next/server";
import { firebaseAdminAuth } from "@/lib/data/firebase-admin";

const UnauthorizedResponse = () => {
  return NextResponse.redirect(
    new URL("/api/auth/unauthorized", import.meta.url)
  );
};

export async function middleware(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token) {
    return UnauthorizedResponse();
  }
  const user = await firebaseAdminAuth.verifyIdToken(token);
  if (!user) {
    return UnauthorizedResponse();
  }
  req.headers.set("x-user", JSON.stringify(user));
  NextResponse.next();
}

export const config = {
  matcher: ["/api/games/:path*", "/api/rooms/:path*"],
};
