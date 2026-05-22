import { NextRequest, NextResponse, type ProxyConfig } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function proxy(request: NextRequest) {
  const bypass = process.env.BYPASS_AUTH === "true";
  if (bypass) return NextResponse.next();

  const authToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("token")?.value;

  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  if (!authToken && publicRoute) return NextResponse.next();

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Valida sessão no Nest e passa dados via header
  try {
    const sessionRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/get-session`,
      {
        headers: {
          cookie: `better-auth.session_token=${authToken}`,
        },
      }
    );

    if (sessionRes.ok) {
      const session = await sessionRes.json();
      const response = NextResponse.next();
      // Passa userId via header para o client não precisar buscar
      if (session?.user?.id) {
        response.headers.set("x-user-id", session.user.id);
        response.headers.set("x-user-name", session.user.name ?? "");
        response.headers.set("x-user-email", session.user.email ?? "");
      }
      return response;
    }
  } catch {}

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};