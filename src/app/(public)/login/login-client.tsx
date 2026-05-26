"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    await signIn.email(
      { email, password },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? "E-mail ou senha incorretos.");
          setLoading(false);
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 border border-[#1e1e2e] rounded-xl overflow-hidden">
        <div className="relative bg-[#0f0f1a] p-10 flex flex-col justify-start gap-12 border-b lg:border-b-0 lg:border-r border-[#1e1e2e] overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(124,58,237,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.04) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "rgba(124,58,237,.15)", filter: "blur(60px)" }}
          />

          <div className="relative z-10">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-none stroke-white stroke-2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <p className="text-white font-bold text-xl tracking-tight">
              GameHQ
            </p>
            <p className="text-[#6366f1] text-xs tracking-widest uppercase mt-0.5">
              Plataforma de Gamificação
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-[#7c3aed] text-xs tracking-widest uppercase flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-[#7c3aed]" />
              Engajamento real
            </p>
            <h1 className="text-white text-3xl font-bold leading-tight tracking-tight mb-3">
              Transforme metas
              <br />
              em <span className="text-[#7c3aed]">conquistas</span>
            </h1>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              Acompanhe desempenho, acumule pontos e troque por recompensas
              reais.
            </p>
          </div>
        </div>

        <div className="bg-[#0d0d17] p-10 flex flex-col justify-center">
          <h2 className="text-white text-2xl font-bold tracking-tight mb-1">
            Bem-vindo de volta
          </h2>
          <p className="text-[#6b7280] text-sm mb-8">
            Entre com suas credenciais para acessar o painel
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[#9ca3af] text-xs uppercase tracking-widest mb-2">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#0a0a14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#374151] focus:outline-none focus:border-[#7c3aed] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] text-xs uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#0a0a14] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#374151] focus:outline-none focus:border-[#7c3aed] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium rounded-lg py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Entrando..." : "Entrar no sistema →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1e1e2e]" />
            <span className="text-[#374151] text-xs tracking-widest">
              acesso restrito
            </span>
            <div className="flex-1 h-px bg-[#1e1e2e]" />
          </div>

          <p className="text-[#374151] text-xs text-center">
            Não consegue acessar? Fale com o{" "}
            <a href="#" className="text-[#6366f1] hover:underline">
              administrador do sistema
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
