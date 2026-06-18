"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, X, Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface PrimeiroAcessoClientProps {
  userId: string;
  userName: string;
}

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

export function PrimeiroAcessoClient({
  userId,
  userName,
}: PrimeiroAcessoClientProps) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const primeiroNome = userName.split(" ")[0];

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/primeiro-acesso`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ novaSenha }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Erro ao definir senha.");
      }
      // Redireciona pro dashboard após sucesso
      window.location.href = "/";
    } catch (e: any) {
      setErro(e.message ?? "Erro ao salvar.");
      setLoading(false);
    }
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
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-zinc-800/60 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-2xl"
          >
            {/* Ícone de boas-vindas */}
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                <ShieldCheck size={24} className="text-indigo-400" />
              </div>
            </div>

            <div className="text-center mb-2">
              <h2 className="text-2xl font-semibold text-zinc-50">
                Bem-vindo, {primeiroNome}! 👋
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Este é seu primeiro acesso. Por segurança, defina uma senha
                pessoal antes de continuar.
              </p>
            </div>

            {/* Info banner */}
            <div className="rounded-xl border border-indigo-800/30 bg-indigo-950/30 px-4 py-3 text-xs text-indigo-300 leading-relaxed">
              🔒 Sua senha temporária não pode mais ser usada após esta etapa.
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
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= f ? c[f - 1] : "#27272a" }}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500">
                  {novaSenha.length < 8
                    ? "Fraca"
                    : novaSenha.length < 10
                      ? "Razoável"
                      : novaSenha.length < 12
                        ? "Boa"
                        : "Forte"}
                </p>
              </div>
            )}

            <SenhaInput
              label="Confirmar senha"
              value={confirmar}
              onChange={setConfirmar}
              placeholder="Repita a nova senha"
              disabled={loading}
            />

            {/* Checklist */}
            <div className="space-y-1.5">
              {[
                { ok: novaSenha.length >= 8, label: "Mínimo 8 caracteres" },
                {
                  ok: novaSenha === confirmar && confirmar.length > 0,
                  label: "Senhas coincidem",
                },
              ].map(({ ok, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${ok ? "bg-emerald-500/20" : "bg-zinc-800"}`}
                  >
                    {ok && <Check size={9} className="text-emerald-400" />}
                  </div>
                  <span className={ok ? "text-emerald-400" : "text-slate-500"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={
                loading || novaSenha.length < 8 || novaSenha !== confirmar
              }
              className="w-full rounded-xl bg-cyan-700 py-4 text-sm font-semibold text-zinc-50 transition hover:bg-cyan-500 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Salvando...
                </>
              ) : (
                "Definir senha e entrar"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
