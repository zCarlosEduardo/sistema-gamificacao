"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";

const esqueciSenhaSchema = z.object({
  email: z.string().email("Email inválido"),
});

type EsqueciSenhaForm = z.infer<typeof esqueciSenhaSchema>;

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<EsqueciSenhaForm>({
    resolver: zodResolver(esqueciSenhaSchema),
  });

  async function onSubmit(data: EsqueciSenhaForm) {
    setLoading(true);
    setError("");

    try {
      await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/redefinir-senha",
      });

      setEnviado(true);
    } catch {
      setError("Erro ao enviar email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-(--color-primary)/10 flex items-center justify-center mb-6">
            <Mail size={24} className="text-(--color-primary-light)" />
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-geist) font-bold">
            Email enviado!
          </h1>
          <p className="text-sm text-(--color-text-muted) mt-2 max-w-xs">
            Se o email <span className="text-(--color-text) font-medium">{getValues("email")}</span> estiver
            cadastrado, você receberá um link pra redefinir sua senha.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Voltar pro login
          </Button>
          <button
            onClick={() => setEnviado(false)}
            className="w-full text-xs text-(--color-text-muted) hover:text-(--color-text) transition-colors text-center"
          >
            Não recebeu? Tentar outro email
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-1.5 text-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Voltar pro login
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-[family-name:var(--font-geist) font-bold">
          Esqueceu sua senha?
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Sem problema digite seu email e a gente manda um link pra redefinir.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          variant="primaryShadow"
          className="w-full"
          size="lg"
        >
          Enviar link de redefinição
        </Button>
      </form>
    </>
  );
}