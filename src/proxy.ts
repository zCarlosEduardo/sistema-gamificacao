import { NextRequest, NextResponse, type ProxyConfig } from "next/server";

const publicRoutes = [
  "/login",
  "/",
  "/recuperar-senha",
  "/redefinir-senha",
  "/primeiro-acesso",
];
const bypass = process.env.BYPASS_AUTH === "true";

export async function proxy(request: NextRequest) {
  // Se bypass ativo, permite tudo
  if (bypass) return NextResponse.next();

  const path = request.nextUrl.pathname;

  // Se for rota pública, permite acesso
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Verifica token de autenticação
  const authToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("token")?.value;

  // Se não tem token e não é rota pública, redireciona para login
  if (!authToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // Se tem token e está em rota pública (como /login), redireciona para dashboard
  if (authToken && publicRoutes.includes(path)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
