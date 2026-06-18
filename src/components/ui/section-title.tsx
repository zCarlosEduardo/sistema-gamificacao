"use client";

interface SectionTitleProps {
  titulo: string;
  subtitulo?: string;
  cor: string;
}

/**
 * Título de seção com barrinha colorida lateral.
 *
 * @example
 * <SectionTitle titulo="Dados Empresariais" cor={corAtual} />
 * <SectionTitle titulo="Grupos Nativos" subtitulo="— não podem ser excluídos" cor={corAtual} />
 */
export function SectionTitle({ titulo, subtitulo, cor }: SectionTitleProps) {
  return (
    <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
      <span className="w-1 h-4 rounded-full shrink-0" style={{ background: cor }} />
      {titulo}
      {subtitulo && (
        <span className="text-xs font-normal text-zinc-400 dark:text-zinc-600 ml-1">
          {subtitulo}
        </span>
      )}
    </h2>
  );
}