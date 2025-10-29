// src/middleware.ts

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isProtected = nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !isLoggedIn) {
    const newUrl = new URL("/login", nextUrl.origin);
    nextUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(newUrl);
  }

  if (isLoggedIn && nextUrl.pathname === "/login") {
    return Response.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return null;
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
