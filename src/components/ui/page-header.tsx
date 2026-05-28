"use client";

interface PageHeaderProps {
  titulo: string;
  descricao?: string;
  action?: React.ReactNode;
}

/**
 * Cabeçalho padrão de página com título, descrição e slot para botão de ação.
 *
 * @example
 * <PageHeader
 *   titulo="Usuários"
 *   descricao="Gerencie os membros do sistema"
 *   action={<button onClick={...}>+ Novo</button>}
 * />
 */
export function PageHeader({ titulo, descricao, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{titulo}</h1>
        {descricao && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{descricao}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}