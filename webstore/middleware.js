import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. Read token from cookies
  const token = request.cookies.get("token")?.value;

  // 2. Current requested path
  const url = request.nextUrl.pathname;

  // 3. All admin routes you want to protect
  const adminRoutes = [
    "/admin",
    "/admin/products",
    "/admin/orders",
    "/admin/reports",
  ];

  // 4. If URL starts with any admin route AND no token → redirect to /login
  if (adminRoutes.some((p) => url.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 5. Default: allow request
  return NextResponse.next();
}
