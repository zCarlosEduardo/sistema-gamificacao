"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginClient() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    setLoading(true);
    setError("");

    await signIn.email(
      {
        email,
        password,
      },
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
    <main className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Ambient */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-100 w-100 rounded-full bg-indigo-700/8 blur-[100px]" />
      <div className="md:absolute w-full p-6 md:p-12 flex justify-center md:justify-start items-center">
        <Image
          src="/assets/purpel-await.svg"
          alt="Página não encontrada"
          width={220}
          height={220}
          priority
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 h-87.5 w-87.5 rounded-full bg-purple-700/8 blur-[100px]" />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-3">
        {/* Left */}
        <section className="z-10 text-center lg:pl-4 lg:text-left">
          <h1 className="mt-6 text-4xl text-zinc-50 leading-tight tracking-widest sm:text-5xl">
            Bem-vindo ao Await
          </h1>

          <p className="mt-6 max-w-sm text-md leading-relaxed text-slate-400 max-lg:mx-auto">
            Seus desafios, metas e conquistas estão esperando por você.
          </p>
        </section>

        {/* Center */}
        <section className="relative flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

          {/* Transformamos o componente em um motion do Framer Motion */}
          <motion.div
            animate={{
              y: [0, 24, 0], 
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut", 
            }}
          >
            <Image
              src="/assets/avatar-login.svg"
              alt="Página não encontrada"
              width={420}
              height={320}
              priority
            />
          </motion.div>
        </section>

        {/* Right */}
        <section className="z-10 w-full lg:pr-4">
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-sm space-y-5 rounded-3xl border border-zinc-800/60 bg-zinc-900/70 p-6 shadow-2xl shadow-zinc-500/10 backdrop-blur-2xl sm:p-8"
          >
            <div>
              <h2 className="text-2xl text-zinc-50 ">Entre na sua conta</h2>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium  text-zinc-50">E-mail</label>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-zinc-500/10 px-5 py-4 text-sm text-slate-200 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-50">Senha</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-zinc-500/10 px-5 py-4 text-sm text-slate-200 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 transition hover:text-slate-300"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-slate-400 transition hover:text-slate-600"
                >
                  Recuperar senha?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl text-zinc-50 bg-cyan-700 py-4 text-sm font-semibold shadow-lg shadow-indigo-900/20 transition hover:bg-cyan-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
