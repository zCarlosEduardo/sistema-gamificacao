import { NextRequest, NextResponse, type ProxyConfig } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function proxy(request: NextRequest) {
  const bypass = process.env.BYPASS_AUTH === "true";
  if (bypass) return NextResponse.next();

  // Captura os possíveis nomes de cookie que o Better Auth utiliza
  const authToken = request.cookies.get("token")?.value 
    ?? request.cookies.get("better-auth.session_token")?.value
    ?? request.cookies.get("__secure-better-auth.session_token")?.value; // Para produção (HTTPS)
    
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  // 1. Não autenticado tentando acessar rota pública (Ex: /login) -> Permite
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // 2. Não autenticado tentando acessar rota privada -> Joga para o Login
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Autenticado tentando acessar o login -> Redireciona para a Home (Evita entrar no login logado)
  if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Se tiver token e for rota privada, deixa o Next.js passar livremente
  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};