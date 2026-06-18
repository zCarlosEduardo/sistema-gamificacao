"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RecuperarSenhaClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setErro("");

    try {
      // Better Auth — forgetPassword
      // Quando SendGrid estiver configurado, isso vai funcionar automaticamente
      const res = await fetch("/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/redefinir-senha`,
        }),
      });

      // Better Auth retorna 200 mesmo se o email não existir (segurança)
      setEnviado(true);
    } catch {
      setErro("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Ambient */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-indigo-700/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-700/8 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Logo */}
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
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <AnimatePresence mode="wait">
            {!enviado ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-zinc-800/60 bg-zinc-900/70 p-8 shadow-2xl shadow-zinc-500/10 backdrop-blur-2xl"
              >
                <div className="mb-2">
                  <h2 className="text-2xl font-semibold text-zinc-50">
                    Recuperar senha
                  </h2>
                  <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                    Informe seu e-mail e enviaremos um link para você criar uma
                    nova senha.
                  </p>
                </div>

                {erro && (
                  <div className="rounded-xl border border-red-800/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                    {erro}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-50">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu e-mail"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-700 bg-zinc-500/10 pl-10 pr-5 py-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-indigo-400 disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-cyan-700 py-4 text-sm font-semibold text-zinc-50 shadow-lg transition hover:bg-cyan-500 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2"
                >
                  <ArrowLeft size={12} /> Voltar para o login
                </Link>
              </motion.form>
            ) : (
              <motion.div
                key="enviado"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-5 rounded-3xl border border-zinc-800/60 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-2xl text-center"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                    <Check size={28} className="text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-50">
                    E-mail enviado!
                  </h2>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Se <span className="text-slate-300">{email}</span> estiver
                    cadastrado, você receberá o link em instantes. Verifique
                    também sua caixa de spam.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <ArrowLeft size={12} /> Voltar para o login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
