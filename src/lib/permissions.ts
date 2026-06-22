export interface MemberPermissions {
  grupoNome: string;
  nativo: boolean;
  permissoes: string[];
}

// Admin = grupo nativo "Administrador" — único que checa por nome
export function isAdmin(member: MemberPermissions | null) {
  if (!member) return false;
  return member.grupoNome === "Administrador" && member.nativo;
}

// Tem qualquer permissão de gestão? (serve pra mostrar seção de gestor)
export function isManager(member: MemberPermissions | null) {
  if (!member) return false;
  if (isAdmin(member)) return true;
  const managerPermissions = [
    "metas.gerenciar", "metas.aprovar",
    "resgates.aprovar", "equipes.gerenciar",
    "usuarios.visualizar", "configuracoes.editar",
  ];
  return managerPermissions.some((p) => member.permissoes.includes(p));
}

// Checagem genérica — admin sempre passa
export function hasPermission(member: MemberPermissions | null, chave: string) {
  if (!member) return false;
  if (isAdmin(member)) return true;
  return member.permissoes.includes(chave);
}

// Shortcuts
export function canManageGoals(member: MemberPermissions | null) {
  return hasPermission(member, "metas.gerenciar");
}

export function canApproveGoals(member: MemberPermissions | null) {
  return hasPermission(member, "metas.aprovar");
}

export function canApproveRedemptions(member: MemberPermissions | null) {
  return hasPermission(member, "resgates.aprovar");
}

export function canManageTeams(member: MemberPermissions | null) {
  return hasPermission(member, "equipes.gerenciar");
}

export function canManageUsers(member: MemberPermissions | null) {
  return hasPermission(member, "usuarios.visualizar");
}

export function canEditSettings(member: MemberPermissions | null) {
  return hasPermission(member, "configuracoes.editar");
}