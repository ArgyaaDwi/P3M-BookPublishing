import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySessionToken } from "./lib/encrypt";

const protectedRouteByRoles = [
  { path: /^\/admin/, roles: ["admin", "ADMIN"] },
  { path: /^\/lecturer/, roles: ["dosen", "DOSEN"] },
  { path: /^\/publisher/, roles: ["penerbit", "PENERBIT"] },
];

export async function middleware(req: NextRequest) {
  console.log("🧪 SECRET_KEY di middleware:", process.env.SECRET_KEY);
  const pathname = req.nextUrl.pathname;
  console.log("menuju", pathname);
  if (
    pathname === "/api/login" ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/login" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/publication")
  ) {
    return NextResponse.next();
  }
  //   jika tidak ada token di cookies
  const sessionToken = req.cookies.get("session")?.value;
  console.log("📦 Session token:", sessionToken);

  if (!sessionToken) {
    console.log("⛔ Tidak ada session token, redirect ke /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // jika ada token
  const session = await verifySessionToken(sessionToken);
  console.log("🔍 Decoded session:", session);

  if (!session?.role) {
    console.log("⛔ Session tidak valid / tidak ada role");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = session.role.toString().toLowerCase();
  console.log("👤 User role:", userRole);
  console.log("📍 Pathname:", pathname);
  // Cek apakah path yang diakses memerlukan role tertentu
  const matchedRoute = protectedRouteByRoles.find((route) =>
    route.path.test(pathname)
  );

  if (matchedRoute) {
    console.log("🔐 Protected route:", matchedRoute.path);

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
