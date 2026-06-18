"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, X, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SenhaInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-50">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-700 bg-zinc-500/10 px-5 py-4 pr-12 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-indigo-400 disabled:opacity-60"
        />
        <button
          type="button"
          onMouseDown={() => setShow(true)}
          onMouseUp={() => setShow(false)}
          onMouseLeave={() => setShow(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function RedefinirSenhaClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [tokenInvalido, setTokenInvalido] = useState(!token);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (novaSenha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      // Better Auth — resetPassword
      const res = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: novaSenha }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Link inválido ou expirado.");
      }
      setSucesso(true);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  if (tokenInvalido) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-zinc-950 flex items-center justify-center px-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto">
            <X size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-50">Link inválido</h2>
          <p className="text-sm text-slate-400">
            Este link é inválido ou já expirou.
          </p>
          <Link
            href="/recuperar-senha"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={12} /> Solicitar novo link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-indigo-700/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-700/8 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

      <div className="absolute w-full p-6 md:p-12 flex justify-center md:justify-start">
        <Image
          src="/assets/purpel-await.svg"
          alt="Await"
          width={180}
          height={180}
          priority
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <AnimatePresence mode="wait">
            {!sucesso ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-zinc-800/60 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-2xl"
              >
                <div className="mb-2">
                  <h2 className="text-2xl font-semibold text-zinc-50">
                    Nova senha
                  </h2>
                  <p className="text-sm text-slate-400 mt-1.5">
                    Escolha uma senha forte com no mínimo 8 caracteres.
                  </p>
                </div>

                {erro && (
                  <div className="rounded-xl border border-red-800/40 bg-red-950/30 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
                    <X size={13} /> {erro}
                  </div>
                )}

                <SenhaInput
                  label="Nova senha"
                  value={novaSenha}
                  onChange={setNovaSenha}
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
                />

                {/* Barra de força */}
                {novaSenha.length > 0 && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => {
                        const f =
                          novaSenha.length >= 12
                            ? 4
                            : novaSenha.length >= 10
                              ? 3
                              : novaSenha.length >= 8
                                ? 2
                                : 1;
                        const c = ["#ef4444", "#f59e0b", "#10b981", "#10b981"];
                        return (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all"
                            style={{
                              background: i <= f ? c[f - 1] : "#27272a",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                <SenhaInput
                  label="Confirmar senha"
                  value={confirmar}
                  onChange={setConfirmar}
                  placeholder="Repita a nova senha"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-cyan-700 py-4 text-sm font-semibold text-zinc-50 transition hover:bg-cyan-500 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Salvando...
                    </>
                  ) : (
                    "Redefinir senha"
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="sucesso"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 rounded-3xl border border-zinc-800/60 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-2xl text-center"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                    <Check size={28} className="text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-50">
                    Senha redefinida!
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Sua senha foi alterada com sucesso.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-cyan-500 hover:text-cyan-400 transition-colors font-medium"
                >
                  Ir para o login →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
