import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const protectedRoutes = new RegExp("/(registration|auth)/[A-Za-z0-9]+");

export default auth(async (req) => {
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutes.test(path);
  console.log("isProtected: ", isProtected);

  if (isProtected) return NextResponse.next();

  console.log("isAuthenticated: ", !!req.auth);

  return NextResponse.next();
});

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
