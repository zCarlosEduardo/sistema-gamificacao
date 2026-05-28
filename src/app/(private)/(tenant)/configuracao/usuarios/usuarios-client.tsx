"use client";

import { useState, useTransition, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useTenant } from "@/contexts/tenant-context";
import {
  Users,
  CheckCircle2,
  PauseCircle,
  Plus,
  Pencil,
  Search,
  UserCheck,
} from "lucide-react";
import {
  Modal,
  Campo,
  MultiSelect,
  Avatar,
  inputCls,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/ui";

interface Usuario {
  id: string;
  name: string;
  email: string;
  image: string | null;
  cpf?: string | null;
  telefone?: string | null;
  role: string;
  createdAt: string;
}

interface Grupo {
  id: string;
  nome: string;
}

interface Equipe {
  id: string;
  nome: string;
}

interface Membro {
  id: string;
  ativo: boolean;
  criadoEm: string;
  usuario: Usuario;
  grupo: Grupo | null;
  equipe: Equipe | null;
}

interface UsuariosClientProps {
  membros: Membro[];
  grupos: Grupo[];
  equipes: Equipe[];
  tenantId: string;
}

function formatCpf(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function UsuariosClient({
  membros: membrosIniciais,
  grupos,
  equipes,
  tenantId,
}: UsuariosClientProps) {
  const { tenant } = useTenant();
  const corPrimaria = tenant?.corPrimaria ?? "#7C3AED";
  const nomeEquipe = tenant?.nomeEquipe ?? "Equipes";

  const [membros, setMembros] = useState<Membro[]>(membrosIniciais);
  const [busca, setBusca] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<
    "todos" | "ativos" | "inativos"
  >("ativos");
  const [isPending, startTransition] = useTransition();

  // Modal criar
  const [modalCriar, setModalCriar] = useState(false);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [equipeId, setEquipeId] = useState("");
  const [cpfBuscando, setCpfBuscando] = useState(false);
  const [cpfEncontrado, setCpfEncontrado] = useState(false);
  const [erroCriar, setErroCriar] = useState("");
  const cpfTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal editar
  const [membroEditando, setMembroEditando] = useState<Membro | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editGrupoId, setEditGrupoId] = useState("");
  const [editEquipeId, setEditEquipeId] = useState("");
  const [editAtivo, setEditAtivo] = useState(true);
  const [erroEditar, setErroEditar] = useState("");
  const [editCpf, setEditCpf] = useState("");

  const ativos = membros.filter((m) => m.ativo).length;
  const inativos = membros.filter((m) => !m.ativo).length;

  const membrosFiltrados = membros.filter((m) => {
    const matchBusca =
      m.usuario.name.toLowerCase().includes(busca.toLowerCase()) ||
      m.usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
      (m.usuario.cpf ?? "").includes(busca);
    const matchGrupo = !filtroGrupo || m.grupo?.id === filtroGrupo;
    const matchAtivo =
      filtroAtivo === "todos" ||
      (filtroAtivo === "ativos" && m.ativo) ||
      (filtroAtivo === "inativos" && !m.ativo);
    return matchBusca && matchGrupo && matchAtivo;
  });

  function handleCpfChange(v: string) {
    const formatted = formatCpf(v);
    setCpf(formatted);
    setCpfEncontrado(false);
    setNome("");
    const raw = formatted.replace(/\D/g, "");
    if (raw.length === 11) {
      setCpfBuscando(true);
      if (cpfTimer.current) clearTimeout(cpfTimer.current);
      cpfTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios?cpf=${raw}`,
            { credentials: "include" },
          );
          if (res.ok) {
            const data = await res.json();
            const usuario = Array.isArray(data) ? data[0] : data;
            if (usuario?.name) {
              setNome(usuario.name);
              setCpfEncontrado(true);
            }
          }
        } catch {
          /* silencioso */
        } finally {
          setCpfBuscando(false);
        }
      }, 500);
    }
  }

  function resetModalCriar() {
    setCpf("");
    setNome("");
    setEmail("");
    setSenha("");
    setTelefone("");
    setGrupoId("");
    setEquipeId("");
    setCpfEncontrado(false);
    setErroCriar("");
  }

  function abrirEditar(membro: Membro) {
    setMembroEditando(membro);
    setEditNome(membro.usuario.name);
    setEditEmail(membro.usuario.email);
    setEditCpf(membro.usuario.cpf ?? "");
    setEditTelefone(membro.usuario.telefone ?? "");
    setEditGrupoId(membro.grupo?.id ?? "");
    setEditEquipeId(membro.equipe?.id ?? "");
    setEditAtivo(membro.ativo);
    setErroEditar("");
  }

  function handleCriar() {
    setErroCriar("");
    startTransition(async () => {
      try {
        const signupRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up/email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nome, email, password: senha }),
          },
        );
        if (!signupRes.ok) {
          const err = await signupRes.json().catch(() => ({}));
          throw new Error(err?.message ?? "Erro ao criar usuário");
        }
        const { user } = await signupRes.json();
        const membroRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/membros`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              usuarioId: user.id,
              grupoId: grupoId || undefined,
              categoriaId: equipeId || undefined,
            }),
          },
        );
        if (!membroRes.ok) throw new Error("Erro ao vincular ao tenant");
        const novoMembro = await membroRes.json();
        setMembros((prev) => [
          {
            ...novoMembro,
            usuario: { ...user, cpf, telefone },
            grupo: grupos.find((g) => g.id === grupoId) ?? null,
            equipe: equipes.find((e) => e.id === equipeId) ?? null,
          },
          ...prev,
        ]);
        setModalCriar(false);
        resetModalCriar();
      } catch (e: unknown) {
        setErroCriar(e instanceof Error ? e.message : "Erro ao criar usuário");
      }
    });
  }

  function handleEditar() {
    if (!membroEditando) return;
    setErroEditar("");
    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}/membros/${membroEditando.usuario.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-tenant-id": tenantId,
            },
            credentials: "include",
            body: JSON.stringify({
              grupoId: editGrupoId || null,
              categoriaId: editEquipeId || null,
              ativo: editAtivo,
            }),
          },
        );
        if (!res.ok) throw new Error("Erro ao atualizar");
        setMembros((prev) =>
          prev.map((m) =>
            m.usuario.id === membroEditando.usuario.id
              ? {
                  ...m,
                  ativo: editAtivo,
                  grupo: grupos.find((g) => g.id === editGrupoId) ?? null,
                  equipe: equipes.find((e) => e.id === editEquipeId) ?? null,
                  usuario: {
                    ...m.usuario,
                    name: editNome,
                    telefone: editTelefone,
                  },
                }
              : m,
          ),
        );
        setMembroEditando(null);
      } catch (e: unknown) {
        setErroEditar(e instanceof Error ? e.message : "Erro ao atualizar");
      }
    });
  }

  return (
    <div className="max-w-full">
      {/* Header */}
      <PageHeader
        titulo="Usuários"
        descricao="Gerencie os membros e seus acessos dentro do sistema"
        action={
          <button
            onClick={() => {
              resetModalCriar();
              setModalCriar(true);
            }}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
            style={{ background: corPrimaria }}
          >
            <Plus size={16} />
            Novo usuário
          </button>
        }
      />
      {/* Cards totais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", valor: membros.length, icon: Users },
          { label: "Ativos", valor: ativos, icon: CheckCircle2 },
          { label: "Inativos", valor: inativos, icon: PauseCircle },
        ].map((c) => (
          <StatCard
            key={c.label}
            label={c.label}
            valor={c.valor}
            icon={c.icon}
          />
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, e-mail ou CPF..."
              className="w-full pl-10 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>
          <select
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          >
            <option value="">Todos os grupos</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nome}
              </option>
            ))}
          </select>
          <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0">
            {(["todos", "ativos", "inativos"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltroAtivo(f)}
                className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${
                  filtroAtivo === f
                    ? "text-white"
                    : "text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                style={filtroAtivo === f ? { background: corPrimaria } : {}}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                  CPF
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                  Grupo
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                  {nomeEquipe}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                  Cadastro
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {membrosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-sm text-zinc-400 dark:text-zinc-600"
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
              {membrosFiltrados.map((membro) => (
                <tr
                  key={membro.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {/* Usuário */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        nome={membro.usuario.name}
                        imagem={membro.usuario.image}
                        cor={corPrimaria}
                        size="sm"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {membro.usuario.name}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                          {membro.usuario.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* CPF */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {membro.usuario.cpf ?? "—"}
                    </span>
                  </td>
                  {/* Grupo */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {membro.grupo ? (
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                        style={{ background: `${corPrimaria}cc` }}
                      >
                        {membro.grupo.nome}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600">
                        —
                      </span>
                    )}
                  </td>
                  {/* Equipes */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {membro.equipe ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {membro.equipe.nome}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600">
                        —
                      </span>
                    )}
                  </td>
                  {/* Cadastro */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(membro.criadoEm)}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge ativo={membro.ativo} />
                  </td>
                  {/* Ação */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => abrirEditar(membro)}
                      className="text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1"
                    >
                      <Pencil size={13} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {membrosFiltrados.length > 0 && (
          <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-600">
            Exibindo {membrosFiltrados.length} de {membros.length} usuários
          </div>
        )}
      </div>

      {/* ── Modal Criar ── */}
      <AnimatePresence>
        {modalCriar && (
          <Modal
            titulo="Adicionar Usuário"
            subtitulo="Após o cadastro o usuário receberá acesso ao sistema"
            onClose={() => {
              setModalCriar(false);
              resetModalCriar();
            }}
          >
            <div className="flex flex-col gap-5">
              {/* CPF */}
              <Campo label="CPF">
                <div className="relative">
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => handleCpfChange(e.target.value)}
                    placeholder="000.000.000-00"
                    className={inputCls}
                  />
                  {cpfBuscando && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                      Buscando...
                    </span>
                  )}
                  {cpfEncontrado && !cpfBuscando && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-500 flex items-center gap-1">
                      <UserCheck size={14} />
                      Encontrado
                    </span>
                  )}
                </div>
                {cpfEncontrado && (
                  <p className="text-xs text-emerald-500 mt-1">
                    Nome preenchido automaticamente. Você pode editar se
                    necessário.
                  </p>
                )}
              </Campo>

              {/* 2 colunas — dados pessoais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Nome completo" required>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="João Silva"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Telefone / WhatsApp">
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="E-mail" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao@empresa.com"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Senha provisória" required>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={inputCls}
                  />
                </Campo>
              </div>

              {/* Grupo + Equipes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Grupo de acesso">
                  <select
                    value={grupoId}
                    onChange={(e) => setGrupoId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Sem grupo</option>
                    {grupos.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>

              <Campo label={nomeEquipe}>
                <select
                  value={equipeId}
                  onChange={(e) => setEquipeId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Sem equipe</option>
                  {equipes.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome}
                    </option>
                  ))}
                </select>
              </Campo>

              {erroCriar && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {erroCriar}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    setModalCriar(false);
                    resetModalCriar();
                  }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCriar}
                  disabled={isPending || !nome || !email || senha.length < 8}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
                  style={{ background: corPrimaria }}
                >
                  {isPending ? "Criando..." : "Criar usuário"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Modal Editar ── */}
      <AnimatePresence>
        {membroEditando && (
          <Modal
            titulo={`Editar usuário`}
            subtitulo={membroEditando.usuario.name}
            onClose={() => setMembroEditando(null)}
          >
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label="Nome completo" required>
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="CPF">
                  <input
                    type="text"
                    value={editCpf}
                    disabled
                    className={`${inputCls} opacity-60 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900`}
                  />
                </Campo>
                <Campo label="Telefone / WhatsApp">
                  <input
                    type="text"
                    value={editTelefone}
                    onChange={(e) => setEditTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className={inputCls}
                  />
                </Campo>
                <Campo label="E-mail" required>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className={inputCls}
                  />
                </Campo>
                <Campo label="Grupo de acesso">
                  <select
                    value={editGrupoId}
                    onChange={(e) => setEditGrupoId(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Sem grupo</option>
                    {grupos.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>

              <Campo label={nomeEquipe}>
                <select
                  value={editEquipeId}
                  onChange={(e) => setEditEquipeId(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Sem equipe</option>
                  {equipes.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label="Status">
                <select
                  value={editAtivo ? "ativo" : "inativo"}
                  onChange={(e) => setEditAtivo(e.target.value === "ativo")}
                  className={inputCls}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </Campo>

              {erroEditar && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                  {erroEditar}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setMembroEditando(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditar}
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors"
                  style={{ background: corPrimaria }}
                >
                  {isPending ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
