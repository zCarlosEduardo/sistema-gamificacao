"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2, Lock } from "lucide-react";

const redefinirSchema = z
  .object({
    newPassword: z.string().min(8, "Senha precisa ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RedefinirForm = z.infer<typeof redefinirSchema>;

export default function RedefinirSenhaPage() {
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
  } = useForm<RedefinirForm>({
    resolver: zodResolver(redefinirSchema),
  });

  useEffect(() => {
    async function validate() {
      if (!token) {
        setValidating(false);
        return;
      }

      try {
        const result = await api.get("/users/reset/validate", { token });
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

  async function onSubmit(data: RedefinirForm) {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });

      setSucesso(true);
    } catch {
      setError("Erro ao redefinir senha. O link pode ter expirado.");
    } finally {
      setLoading(false);
    }
  }

  if (validating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 size={32} className="text-(--color-primary) animate-spin" />
        <p className="mt-4 text-sm text-(--color-text-muted)">
          Validando link...
        </p>
      </div>
    );
  }

  if (!token || !valid) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <Lock size={24} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-(family-name:--font-geist) font-bold">
            Link inválido
          </h1>
          <p className="text-sm text-(--color-text-muted) mt-2 max-w-xs">
            Esse link de redefinição é inválido ou expirou. Solicite um novo.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full mt-8"
          onClick={() => router.push("/esqueci-senha")}
        >
          Solicitar novo link
        </Button>
      </>
    );
  }

  if (sucesso) {
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle size={24} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-(family-name:--font-geist) font-bold">
            Senha redefinida!
          </h1>
          <p className="text-sm text-(--color-text-muted) mt-2">
            Sua nova senha foi salva. Faça login pra continuar.
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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-(family-name:--font-geist) font-bold">
          Redefinir senha{userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Crie uma nova senha pra sua conta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="newPassword"
          label="Nova senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Input
          id="confirmPassword"
          label="Confirmar nova senha"
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
          Redefinir senha
        </Button>
      </form>
    </>
  );
}
