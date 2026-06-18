"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2 } from "lucide-react";

const senhaSchema = z
  .object({
    password: z.string().min(8, "Senha precisa ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SenhaForm = z.infer<typeof senhaSchema>;

export default function PrimeiroAcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [userName, setUserName] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SenhaForm>({
    resolver: zodResolver(senhaSchema),
  });

  useEffect(() => {
    async function validate() {
      if (!token) {
        setValidating(false);
        return;
      }

      try {
        const result = await api.get("/users/invite/validate", { token });
        setValid(true);
        setUserName(result.name);
      } catch {
        setValid(false);
      } finally {
        setValidating(false);
      }
    }

    validate();
  }, [token]);

  async function onSubmit(data: SenhaForm) {
    setLoading(true);
    setError("");

    try {
      await api.post("/users/invite/accept", {
        token,
        password: data.password,
      });

      setSucesso(true);
    } catch {
      setError("Erro ao definir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Loading
  if (validating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 size={32} className="text-(--color-primary) animate-spin" />
        <p className="mt-4 text-sm text-(--color-text-muted)">Validando convite...</p>
      </div>
    );
  }

  // Token inválido ou ausente
  if (!token || !valid) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-[family-name:var(--font-geist) font-bold">
            Convite inválido
          </h1>
          <p className="text-sm text-(--color-text-muted) mt-2">
            Esse link de convite é inválido ou já foi utilizado. Fale com o administrador da sua empresa.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full mt-8"
          onClick={() => router.push("/login")}
        >
          Ir pro login
        </Button>
      </>
    );
  }

  // Sucesso
  if (sucesso) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle size={24} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-geist) font-bold">
            Tudo pronto!
          </h1>
          <p className="text-sm text-(--color-text-muted) mt-2">
            Sua senha foi definida. Faça login pra começar.
          </p>
        </div>

        <Button
          variant="primaryShadow"
          className="w-full mt-8"
          size="lg"
          onClick={() => router.push("/login")}
        >
          Ir pro login
        </Button>
      </>
    );
  }

  // Formulário
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-[family-name:var(--font-geist) font-bold">
          Bem-vindo, {userName}! 🎉
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Defina sua senha pra começar a usar o Await
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="password"
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
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
          Definir senha e começar
        </Button>
      </form>
    </>
  );
}