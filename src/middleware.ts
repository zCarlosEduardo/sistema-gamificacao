import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/primeiro-acesso"];
const authRoutes = ["/login", "/primeiro-acesso"];
const marketingRoutes = ["/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isLoggedIn = !!sessionCookie;

  // Logado tentando acessar login ou marketing → dashboard
  if (isLoggedIn && [...authRoutes, ...marketingRoutes].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Não logado tentando acessar área protegida → login
  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
