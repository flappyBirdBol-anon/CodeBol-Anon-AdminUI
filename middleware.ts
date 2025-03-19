import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken"); // Read token from cookies

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect if no token
  }

  return NextResponse.next(); // Continue if authenticated
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Add your protected routes here
};
