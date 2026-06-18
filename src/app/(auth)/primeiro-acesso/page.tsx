"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const senhaSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(8, "Nova senha precisa ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SenhaForm = z.infer<typeof senhaSchema>;

export default function PrimeiroAcessoPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SenhaForm>({
    resolver: zodResolver(senhaSchema),
  });

  async function onSubmit(data: SenhaForm) {
    setLoading(true);
    setError("");

    try {
      await api.patch("/users/me/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      router.push("/dashboard");
    } catch {
      setError("Erro ao alterar senha. Verifique a senha atual.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Bem-vindo ao Await!</CardTitle>
      <CardDescription>
        É seu primeiro acesso — crie uma senha nova pra continuar
      </CardDescription>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          id="currentPassword"
          label="Senha temporária"
          type="password"
          placeholder="Senha que você recebeu"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <Input
          id="newPassword"
          label="Nova senha"
          type="password"
          placeholder="••••••••"
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
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Definir senha e continuar
        </Button>
      </form>
    </Card>
  );
}