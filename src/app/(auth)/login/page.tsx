"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    setError("");

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError("Email ou senha incorretos");
        return;
      }

      // Busca tenants do usuário
      const { tenants, needsSelection } = await api.get("/tenants/mine");

      if (tenants.length === 0) {
        setError("Você não está vinculado a nenhuma empresa.");
        return;
      }

      if (needsSelection) {
        // Múltiplos tenants — redireciona pra seleção
        router.push("/selecionar-empresa");
        return;
      }

      // Tenant único — seleciona automaticamente
      await api.post("/tenants/select", { tenantId: tenants[0].id });

      // Agora sim pode checar primeiro acesso
      const me = await api.get("/users/me");
      if (me.user.primeiroAcesso) {
        router.push("/primeiro-acesso");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Entrar</CardTitle>
      <CardDescription>Acesse com seu email e senha</CardDescription>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Entrar
        </Button>
      </form>
    </Card>
  );
}
