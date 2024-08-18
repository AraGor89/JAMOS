// export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const config = {
  matcher: [
    "/api/deleteCharacteristic",
    "/api/acceptPartner",
    "/api/createCharacteristic",
    "/api/deletePartnership",
    "/api/editCharacteristic",
    "/api/editProfile",
    "/api/profile",
    "/api/rejectPartner",
    "/api/requestPartner",
    // "/notifications",
    // "/profile",
  ],
};

export default withAuth({
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export async function middleware(req: NextRequest) {
  const isProtectedRoute = config.matcher.includes(req.nextUrl.pathname);
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  return NextResponse.next();
}
