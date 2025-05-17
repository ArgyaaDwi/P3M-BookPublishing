import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySessionToken } from "./lib/encrypt";

const protectedRouteByRoles = [
  { path: /^\/admin/, roles: ["admin"] },
  { path: /^\/lecturer/, roles: ["dosen"] },
  { path: /^\/publisher/, roles: ["penerbit"] },
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("menuju", pathname);
  if (
    pathname === "/api/login" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/login" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/assets/")
  ) {
    return NextResponse.next();
  }
  //   jika tidak ada token di cookies
  const sessionToken = req.cookies.get("session")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // jika ada token
  const session = await verifySessionToken(sessionToken);
  if (!session?.role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = session.role.toString().toLowerCase();
  // Cek apakah path yang diakses memerlukan role tertentu
  const matchedRoute = protectedRouteByRoles.find((route) =>
    route.path.test(pathname)
  );

  if (matchedRoute) {
    // Jika role pengguna tidak ada dalam daftar role yang diperbolehkan
    if (!matchedRoute.roles.includes(userRole)) {
      console.log(
        `Akses ditolak: ${userRole} tidak memiliki akses ke ${pathname}`
      );
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|login).*)",
    // "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|login).*)",
  ],
};
// export const config = {
//   matcher: [
//     "/api/:path*",
//     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|login).*)",
//   ],
// };
