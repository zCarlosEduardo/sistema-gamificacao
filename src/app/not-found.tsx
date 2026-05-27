import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(120,120,120,0.12),transparent_70%)]" />

      <div className="flex max-w-5xl flex-col items-center gap-10 lg:flex-row animate-in fade-in duration-500">
        <Image
          src="/assets/not-found.svg"
          alt="Página não encontrada"
          width={320}
          height={320}
          priority
        />

        <div className="max-w-md">
          <span className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            Error 404
          </span>

          <h1 className="mt-3 text-4xl font-light tracking-wide text-zinc-900 dark:text-zinc-100">
            Ops, algo deu errado...
          </h1>

          <p className="mt-4 leading-relaxed text-zinc-500 dark:text-zinc-400">
            A página que você tentou acessar não existe,
            foi removida ou o link está incorreto.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/"
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-80 dark:bg-white dark:text-black"
            >
              Página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}