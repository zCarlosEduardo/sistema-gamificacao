// ─────────────────────────────────────────────
// TENANT
// ─────────────────────────────────────────────

/** Shape completa do tenant — usada em EmpresaClient e PersonalizacaoClient */
export interface Tenant {
  id: string;
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  logo: string | null;
  corPrimaria: string;
  corSecundaria: string;
  nomeMoeda: string;
  nomeMeta: string;
  nomePontos: string;
  nomeEquipe: string;
  nomeLoja: string;
  nomeUsuario: string;
}

export type TenantNomenclaturas = Pick<
  Tenant,
  | "nomeMoeda"
  | "nomeMeta"
  | "nomePontos"
  | "nomeEquipe"
  | "nomeLoja"
  | "nomeUsuario"
>;

export interface Props {
  tenantId: string;
  grupos: GrupoPermissao[];
  tenant: Tenant;
  produtos: Produto[];
  categorias: Categoria[];
  resgateAtivo: boolean;
  nomePeriodo?: string;
  corPrimaria: string;
  corSecundaria: string;
}

/** Shape reduzida do tenant usada no contexto e na Topbar */

/** Shape mínima usada na tela de trocar empresa */
export interface TenantCard {
  id: string;
  nome: string;
  cnpj?: string;
  logo: string | null;
  corPrimaria: string;
}

export interface AvisoBannerProps {
  resgateAtivo: boolean;
  nomePeriodo?: string;
  corPrimaria: string;
  corSecundaria?: string;
}

// ─────────────────────────────────────────────
// USUÁRIO / SESSÃO
// ─────────────────────────────────────────────

export interface User {
  name: string;
  email: string;
}

export interface Membro {
  role: string;
  permissoes: string[];
}

export interface TrocarEmpresaClientProps {
  tenants: Tenant[];
  usuarioNome: string;
  tenantAtualId?: string;
}

export interface AvatarProps {
  nome: string;
  imagem?: string | null;
  cor: string;
  corSecundaria?: string;
  size?: "sm" | "md" | "lg";
}

// ─────────────────────────────────────────────
// CATEGORIA
// ─────────────────────────────────────────────

export type CategoriaTipo = "PRODUTO" | "EQUIPE";

/** Shape completa — usada em CategoriasClient */
export interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: CategoriaTipo;
  ativo: boolean;
  criadoEm: string;
}

/** Shape reduzida — usada como relação em Produto e nos selects */
export interface CategoriaRef {
  id: string;
  nome: string;
}

// ─────────────────────────────────────────────
// PRODUTO
// ─────────────────────────────────────────────

export interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  valorPontos: number;
  valorEstimado: number | null;
  imagem: string | null;
  emoji: string | null;
  ativo: boolean;
  criadoEm: string;
  categoria: CategoriaRef | null;
}

// ─────────────────────────────────────────────
// RESGATE
// ─────────────────────────────────────────────

export interface Resgate {
  id: string;
  produtoId: string;
  produtoNome: string;
  produtoEmoji: string | null;
  valorPontos: number;
  criadoEm: string;
}

// ─────────────────────────────────────────────
// GRUPOS DE PERMISSÃO
// ─────────────────────────────────────────────

export interface GrupoPermissaoItem {
  id: string;
  chave: string;
}

export interface GrupoPermissao {
  id: string;
  nome: string;
  descricao: string | null;
  nativo: boolean;
  ativo: boolean;
  criadoEm: string;
  permissoes: GrupoPermissaoItem[];
  _count: { membros: number };
}

// ─────────────────────────────────────────────
// NAVEGAÇÃO
// ─────────────────────────────────────────────

export interface MenuItem {
  label: (tenant: Tenant | null) => string;
  href: string;
  permission: string | null;
}
