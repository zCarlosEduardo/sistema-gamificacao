// ─── Auth ───
export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  telefone?: string;
  tema: string;
  primeiroAcesso: boolean;
  createdAt: string;
}

// ─── Tenant ───
export interface Tenant {
  id: string;
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  logo?: string;
  ativo: boolean;
  corPrimaria: string;
  corSecundaria: string;
  nomeMoeda: string;
  nomeMeta: string;
  nomePontos: string;
  nomeEquipe: string;
  nomeLoja: string;
  nomeUsuario: string;
  nomePool: string;
  nomeGiro: string;
  multiplicadorPontos: number;
}

export interface TenantListItem {
  id: string;
  nome: string;
  logo: string | null;
  corPrimaria: string;
}

// ─── Membro ───
export interface Member {
  id: string;
  ativo: boolean;
  saldoCoins: number;
  saldoPontos: number;
  girosDisponiveis: number;
  grupoNome: string;
  nativo: boolean;
  permissoes: string[];
}

export interface MemberWithUser extends Member {
  nome: string;
  email: string;
  cpf?: string;
}

export interface Saldo {
  coins: number;
  pontos: number;
  giros: number;
}

// ─── Permissões ───
export interface PermissionGroup {
  id: string;
  nome: string;
  descricao?: string;
  nativo: boolean;
  ativo: boolean;
  permissoes: string[];
}

// ─── Equipe ───
export interface Team {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  totalMembros?: number;
}

export interface TeamDetail extends Team {
  membros: { memberId: string; nome: string; email: string }[];
}

// ─── Produto ───
export interface ProductCategory {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  valorPontos: number;
  valorEstimado?: number;
  imagem?: string;
  emoji?: string;
  ativo: boolean;
  categoria?: string;
}

// ─── Meta ───
export interface Goal {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: "INDIVIDUAL" | "EQUIPE";
  status: "ATIVA" | "PAUSADA" | "ENCERRADA";
  valorAlvo: number;
  unidade?: string;
  girosRecompensa: number;
  dataInicio: string;
  dataFim?: string;
  teamId?: string;
  totalAssignments?: number;
}

export interface GoalAssignment {
  id: string;
  goalId: string;
  memberId: string;
  progresso: number;
  status: "EM_ANDAMENTO" | "CONCLUIDA" | "APROVADA" | "REJEITADA";
  nome?: string;
}

export interface GoalDetail extends Goal {
  assignments: GoalAssignment[];
}

// ─── Roleta ───
export interface PoolPrize {
  id: string;
  nome: string;
  valor: number;
  quantidadeDiaria: number;
  ativo: boolean;
}

export interface SpinResult {
  coinsGanhos: number;
  pontosGanhos: number;
  premioEspecial: string | null;
  girosRestantes: number;
}

// ─── Resgate ───
export interface Redemption {
  id: string;
  pontosGastos: number;
  status: "PENDENTE" | "APROVADO" | "REJEITADO" | "ENTREGUE";
  observacao?: string;
  createdAt: string;
  membroNome?: string;
  produtoNome?: string;
  produtoImagem?: string;
  produtoEmoji?: string;
}

// ─── Ledger ───
export interface LedgerEntry {
  id: string;
  tipo: string;
  recurso: "COINS" | "PONTOS" | "GIROS";
  quantidade: number;
  descricao: string;
  createdAt: string;
}

// ─── Audit Log ───
export interface AuditLogEntry {
  id: string;
  actorId: string;
  acao: string;
  recursoTipo: string;
  recursoId?: string;
  descricao: string;
  detalhes?: any;
  createdAt: string;
}

// ─── Dashboard ───
export interface PlayerDashboard {
  saldo: Saldo & { [key: string]: number };
  metasAtivas: (GoalAssignment & { titulo: string; valorAlvo: number; unidade?: string })[];
  resgatesPendentes: Redemption[];
}

export interface ManagerDashboard {
  metas: { total: number; ativas: number };
  resgates: { total: number; pendentes: number };
  membros: { total: number; ativos: number };
  ranking: { nome: string; saldoPontos: number; saldoCoins: number }[];
  aguardandoAprovacao: (GoalAssignment & { titulo: string; nome: string })[];
}

// ─── API Responses ───
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: { campo: string; mensagem: string }[];
}


// ─── Notificacaoes ───
export interface Announcement {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: "INFO" | "ALERTA" | "SUCESSO";
  ativo: boolean;
  fixado: boolean;
  expiraEm?: string | null;
  createdAt: string;
}

export interface AdminAnalytics {
  topProducts: { nome: string; total: number; pontosTotal: number }[];
  topMembers: { nome: string; saldoPontos: number; saldoCoins: number; totalMetasBatidas: number }[];
  topTeams: { nome: string; totalMembros: number; pontosTotal: number }[];
  investimento: { totalEstimado: number; totalResgates: number; totalPontosGastos: number };
  resgatesPorStatus: { status: string; total: number }[];
}

export interface TopbarProps {
  user: { name: string; email: string };
  tenant?: { nome: string; logo?: string; corPrimaria?: string };
  saldo?: { coins: number; pontos: number; giros: number };
  memberId?: string;
  tenantCount?: number;
  nomenclaturas?: {
    moeda: string;
    pontos: string;
    meta: string;
    equipe: string;
    loja: string;
    giro: string;
    pool: string;
  };
}

export interface PendingApproval {
  assignmentId: string;
  goalId: string;
  titulo: string;
  tipo: "INDIVIDUAL" | "EQUIPE";
  valorAlvo: number;
  unidade?: string;
  girosRecompensa: number;
  progresso: number;
  memberId: string;
  memberNome: string;
}