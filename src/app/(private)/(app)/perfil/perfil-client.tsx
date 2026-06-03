"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, X, Loader2, Lock, User, Mail, CreditCard } from "lucide-react";
import { Avatar } from "@/components";
import { useTenant } from "@/contexts/tenant-context";

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  image: string | null;
}

interface PerfilClientProps {
  user: User;
}

type Tab = "dados" | "senha";

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
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white pr-11 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors placeholder-zinc-400 dark:placeholder-zinc-600 disabled:opacity-50"
        />
        <button
          type="button"
          onMouseDown={() => setShow(true)}
          onMouseUp={() => setShow(false)}
          onMouseLeave={() => setShow(false)}
          onTouchStart={() => setShow(true)}
          onTouchEnd={() => setShow(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export function PerfilClient({ user }: PerfilClientProps) {
  const { tenant } = useTenant();
  const corPrimaria   = tenant?.corPrimaria   ?? "#7C3AED";
  const corSecundaria = tenant?.corSecundaria ?? "#A78BFA";

  const [tab, setTab] = useState<Tab>("dados");

  // Dados pessoais
  const [nome, setNome] = useState(user.name);
  const [salvandoDados, setSalvandoDados] = useState(false);
  const [sucessoDados, setSucessoDados] = useState(false);
  const [erroDados, setErroDados] = useState("");

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  function hexToRgba(hex: string, alpha: number) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const n = parseInt(hex, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  async function handleSalvarDados() {
    if (!nome.trim()) return;
    setSalvandoDados(true);
    setErroDados("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: nome.trim() }),
        },
      );
      if (!res.ok) throw new Error("Erro ao salvar.");
      setSucessoDados(true);
      setTimeout(() => setSucessoDados(false), 3000);
    } catch (e: any) {
      setErroDados(e.message ?? "Erro ao salvar.");
    } finally {
      setSalvandoDados(false);
    }
  }

  async function handleTrocarSenha() {
    setErroSenha("");
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErroSenha("Preencha todos os campos.");
      return;
    }
    if (novaSenha.length < 8) {
      setErroSenha("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErroSenha("As senhas não coincidem.");
      return;
    }
    setSalvandoSenha(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${user.id}/senha`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ senhaAtual, novaSenha }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Senha atual incorreta.");
      }
      setSucessoSenha(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setTimeout(() => setSucessoSenha(false), 3000);
    } catch (e: any) {
      setErroSenha(e.message ?? "Erro ao trocar a senha.");
    } finally {
      setSalvandoSenha(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: "dados",  label: "Dados pessoais", icon: User },
    { key: "senha",  label: "Segurança",       icon: Lock },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header com avatar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex items-center gap-5"
      >
        <div className="relative shrink-0">
          <Avatar
            nome={user.name}
            imagem={user.image ?? undefined}
            cor={corPrimaria}
            corSecundaria={corSecundaria}
            size="lg"
          />
          {/* Ring animado */}
          <div
            className="absolute -inset-1 rounded-full opacity-30 animate-spin-slow"
            style={{
              background: `conic-gradient(${corPrimaria}, ${corSecundaria}, ${corPrimaria})`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
            }}
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white truncate">
            {user.name}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
          {user.cpf && (
            <p className="text-xs text-zinc-400 mt-0.5">{user.cpf}</p>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 border border-zinc-200 dark:border-zinc-700">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-zinc-700"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo das tabs */}
      <AnimatePresence mode="wait">
        {tab === "dados" && (
          <motion.div
            key="dados"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5"
          >
            {/* Nome */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                <span className="flex items-center gap-1.5">
                  <User size={11} />
                  Nome completo
                </span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors placeholder-zinc-400"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Email — readonly */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail size={11} />
                  E-mail
                  <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md">
                    não editável
                  </span>
                </span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-70"
              />
            </div>

            {/* CPF — readonly */}
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={11} />
                  CPF
                  <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md">
                    não editável
                  </span>
                </span>
              </label>
              <input
                type="text"
                value={user.cpf ?? "Não informado"}
                disabled
                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-70"
              />
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {erroDados && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  <X size={12} /> {erroDados}
                </motion.p>
              )}
              {sucessoDados && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  <Check size={12} /> Dados salvos com sucesso!
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleSalvarDados}
              disabled={salvandoDados || nome.trim() === user.name}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})` }}
            >
              {salvandoDados ? (
                <><Loader2 size={14} className="animate-spin" /> Salvando...</>
              ) : (
                "Salvar alterações"
              )}
            </button>
          </motion.div>
        )}

        {tab === "senha" && (
          <motion.div
            key="senha"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5"
          >
            <div
              className="flex items-start gap-3 p-4 rounded-xl text-sm"
              style={{
                background: hexToRgba(corPrimaria, 0.06),
                border: `1px solid ${hexToRgba(corPrimaria, 0.15)}`,
              }}
            >
              <Lock size={15} className="shrink-0 mt-0.5" style={{ color: corPrimaria }} />
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Sua senha deve ter no mínimo 8 caracteres. Nunca compartilhe sua senha com ninguém.
              </p>
            </div>

            <SenhaInput
              label="Senha atual"
              value={senhaAtual}
              onChange={setSenhaAtual}
              placeholder="Digite sua senha atual"
              disabled={salvandoSenha}
            />
            <SenhaInput
              label="Nova senha"
              value={novaSenha}
              onChange={setNovaSenha}
              placeholder="Mínimo 8 caracteres"
              disabled={salvandoSenha}
            />
            <SenhaInput
              label="Confirmar nova senha"
              value={confirmarSenha}
              onChange={setConfirmarSenha}
              placeholder="Repita a nova senha"
              disabled={salvandoSenha}
            />

            {/* Força da senha */}
            {novaSenha.length > 0 && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => {
                    const forca = novaSenha.length >= 12 ? 4 : novaSenha.length >= 10 ? 3 : novaSenha.length >= 8 ? 2 : 1;
                    const cores = ["#ef4444", "#f59e0b", "#10b981", "#10b981"];
                    return (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= forca ? cores[forca - 1] : "#e5e7eb" }}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-zinc-400">
                  {novaSenha.length < 8 ? "Fraca" : novaSenha.length < 10 ? "Razoável" : novaSenha.length < 12 ? "Boa" : "Forte"}
                </p>
              </div>
            )}

            <AnimatePresence>
              {erroSenha && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  <X size={12} /> {erroSenha}
                </motion.p>
              )}
              {sucessoSenha && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  <Check size={12} /> Senha alterada com sucesso!
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleTrocarSenha}
              disabled={salvandoSenha}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corSecundaria})` }}
            >
              {salvandoSenha ? (
                <><Loader2 size={14} className="animate-spin" /> Alterando...</>
              ) : (
                "Alterar senha"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}