"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

      const { tenants, needsSelection } = await api.get("/tenants/mine");

      if (tenants.length === 0) {
        setError("Você não está vinculado a nenhuma empresa.");
        return;
      }

      if (needsSelection) {
        router.push("/selecionar-empresa");
        return;
      }

      await api.post("/tenants/select", { tenantId: tenants[0].id });

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
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-(family-name:--font-geist) font-bold">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          Entre com seu email e senha pra continuar
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
          className="p-3"
          />
        <div>
          <Input
            id="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
            className="p-3"
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              onClick={() => router.push("/esqueci-senha")}
              className="text-xs text-(--color-primary-light) hover:text-(--color-primary) transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>
        </div>

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
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-(--color-text-muted)">
        Problemas pra acessar? Fale com o administrador da sua empresa.
      </p>
    </>
  );
}