"use client";

import { useState, useTransition, useMemo } from "react";
import { Plus, Trash2, Settings, Calendar, ToggleLeft, ToggleRight, Info, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useTenant } from "@/contexts/tenant-context";
import { PageHeader, Campo, inputCls } from "@/components";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PoolItem {
  id: string;
  nome: string;
  valor: number;
  quantidade: number;
  ativo: boolean;
}

interface JanelaTroca {
  id: string;
  tipo: "MANUAL" | "AGENDADA";
  aberta: boolean;
  dataInicio: string | null;
  dataFim: string | null;
  label: string;
}

interface ConfigGeral {
  metasPorDia: number;
  taxaMargem: number;
  multiplicadorPontos: number;
  membrosAtivos: number;
}

interface Props {
  tenantId: string;
  poolIniciais: PoolItem[];
  configInicial: ConfigGeral;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gerarId() {
  return Math.random().toString(36).slice(2, 10);
}

// Cores por valor do coin
function corCoin(valor: number) {
  if (valor >= 100) return { bg: "#f59e0b", ring: "#fbbf24" }; // ouro
  if (valor >= 50)  return { bg: "#a855f7", ring: "#c084fc" }; // roxo
  if (valor >= 20)  return { bg: "#3b82f6", ring: "#60a5fa" }; // azul
  if (valor >= 5)   return { bg: "#10b981", ring: "#34d399" }; // verde
  return { bg: "#71717a", ring: "#a1a1aa" };                   // cinza
}

// ─── CardCoinEspecial ─────────────────────────────────────────────────────────

function CardCoinEspecial({
  item,
  corPrimaria,
  nomeMoeda,
  multiplicador,
  onAtualizar,
  onRemover,
}: {
  item: PoolItem;
  corPrimaria: string;
  nomeMoeda: string;
  multiplicador: number;
  onAtualizar: (id: string, campo: keyof PoolItem, valor: unknown) => void;
  onRemover: (id: string) => void;
}) {
  const cor = corCoin(item.valor);
  const pontos = (item.valor * multiplicador).toFixed(0);

  return (
    <div className={`relative group rounded-2xl border-2 transition-all ${
      item.ativo
        ? "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
        : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-50"
    }`}>
      {/* Toggle + delete no canto */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
        <button onClick={() => onAtualizar(item.id, "ativo", !item.ativo)}>
          {item.ativo
            ? <ToggleRight size={20} style={{ color: corPrimaria }} />
            : <ToggleLeft size={20} className="text-zinc-400" />}
        </button>
        <button
          onClick={() => onRemover(item.id)}
          className="opacity-0 group-hover:opacity-100 text-zinc-300 dark:text-zinc-600 hover:text-red-400 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-4 pt-3">
        {/* Moeda */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
            style={{ backgroundColor: cor.bg, boxShadow: `0 4px 14px ${cor.ring}55` }}
          >
            {item.valor}
          </div>
          <div className="flex-1 min-w-0 pr-12">
            <input
              type="text"
              value={item.nome}
              onChange={(e) => onAtualizar(item.id, "nome", e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none placeholder-zinc-400 truncate"
              placeholder="Nome do coin"
            />
            <p className="text-xs text-zinc-400 mt-0.5">
              = <span className="font-medium text-zinc-600 dark:text-zinc-300">{pontos} pts</span>
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">{nomeMoeda}</p>
            <input
              type="number"
              min={2}
              value={item.valor}
              onChange={(e) => onAtualizar(item.id, "valor", Math.max(2, Number(e.target.value)))}
              className="w-full text-center text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Qtd/dia</p>
            <input
              type="number"
              min={0}
              value={item.quantidade}
              onChange={(e) => onAtualizar(item.id, "quantidade", Math.max(0, Number(e.target.value)))}
              className="w-full text-center text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CardJanela ───────────────────────────────────────────────────────────────

function CardJanela({
  janela,
  corPrimaria,
  onAtualizar,
  onRemover,
}: {
  janela: JanelaTroca;
  corPrimaria: string;
  onAtualizar: (id: string, dados: Partial<JanelaTroca>) => void;
  onRemover: (id: string) => void;
}) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={janela.label}
          onChange={(e) => onAtualizar(janela.id, { label: e.target.value })}
          className="flex-1 bg-transparent text-sm font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none min-w-0"
          placeholder="Nome da janela"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            janela.aberta ? "bg-emerald-400/10 text-emerald-400" : "bg-zinc-400/10 text-zinc-400"
          }`}>
            {janela.aberta ? "Aberta" : "Fechada"}
          </span>
          <button onClick={() => onRemover(janela.id)} className="text-zinc-300 dark:text-zinc-600 hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["MANUAL", "AGENDADA"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onAtualizar(janela.id, { tipo: t })}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              janela.tipo === t
                ? "text-white border-transparent"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"
            }`}
            style={janela.tipo === t ? { backgroundColor: corPrimaria } : {}}
          >
            {t === "MANUAL" ? "Manual" : "Agendada"}
          </button>
        ))}
      </div>

      {janela.tipo === "MANUAL" ? (
        <button
          onClick={() => onAtualizar(janela.id, { aberta: !janela.aberta })}
          className={`w-full py-2 rounded-lg text-xs font-medium border transition-colors ${
            janela.aberta
              ? "border-red-300 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              : "text-white border-transparent hover:opacity-80"
          }`}
          style={!janela.aberta ? { backgroundColor: corPrimaria } : {}}
        >
          {janela.aberta ? "Fechar Janela" : "Abrir Janela"}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Início", campo: "dataInicio" as const },
            { label: "Fim",    campo: "dataFim"    as const },
          ].map(({ label, campo }) => (
            <div key={campo}>
              <p className="text-xs text-zinc-400 mb-1">{label}</p>
              <input
                type="datetime-local"
                value={janela[campo] ?? ""}
                onChange={(e) => onAtualizar(janela.id, { [campo]: e.target.value })}
                className="w-full text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function PoolsClient({ tenantId, poolIniciais, configInicial }: Props) {
  const { tenant, atualizarTenant } = useTenant();

  const nomeMoeda    = tenant?.nomeMoeda   ?? "Coins";
  const nomePool     = tenant?.nomePool    ?? "Pool";
  const nomePontos   = tenant?.nomePontos  ?? "Pontos";
  const corPrimaria  = tenant?.corPrimaria ?? "#7C3AED";

  const [pool,    setPool]    = useState<PoolItem[]>(poolIniciais);
  const [config,  setConfig]  = useState<ConfigGeral>(configInicial);
  const [janelas, setJanelas] = useState<JanelaTroca[]>([
    { id: "j1", tipo: "MANUAL", aberta: true, dataInicio: null, dataFim: null, label: "Janela Atual" },
  ]);

  const [isPendingPool,   startPool]   = useTransition();
  const [isPendingConfig, startConfig] = useTransition();
  const [isPendingReset,  startReset]  = useTransition();
  const [erroPool,   setErroPool]   = useState("");
  const [erroConfig, setErroConfig] = useState("");
  const [salvoPool,   setSalvoPool]   = useState(false);
  const [salvoConfig, setSalvoConfig] = useState(false);
  const [resetado,    setResetado]    = useState(false);

  // ─── Cálculo automático ────────────────────────────────────────────────────
  // Total de giros esperados no dia com margem
  const totalGirosDia = useMemo(() => {
    const base = config.metasPorDia * config.membrosAtivos;
    return Math.ceil(base * (1 + config.taxaMargem / 100));
  }, [config]);

  // Total de coins especiais configurados
  const totalEspeciais = useMemo(
    () => pool.filter((i) => i.ativo).reduce((acc, i) => acc + i.quantidade, 0),
    [pool]
  );

  // Coins de 1 gerados automaticamente para completar o pool
  const coinsPadrao = Math.max(0, totalGirosDia - totalEspeciais);

  // ─── Ações do pool ─────────────────────────────────────────────────────────

  function adicionarItem() {
    setPool((prev) => [
      ...prev,
      { id: gerarId(), nome: `${nomeMoeda} Especial`, valor: 5, quantidade: 5, ativo: true },
    ]);
  }

  function atualizarItem(id: string, campo: keyof PoolItem, valor: unknown) {
    setPool((prev) => prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)));
  }

  function removerItem(id: string) {
    setPool((prev) => prev.filter((i) => i.id !== id));
  }

  function salvarPool() {
    setErroPool("");
    setSalvoPool(false);
    startPool(async () => {
      try {
        for (const item of pool) {
          const existe = poolIniciais.find((p) => p.id === item.id);
          await fetch(
            existe
              ? `${process.env.NEXT_PUBLIC_API_URL}/pools/${item.id}`
              : `${process.env.NEXT_PUBLIC_API_URL}/pools`,
            {
              method: existe ? "PATCH" : "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
              body: JSON.stringify({ nome: item.nome, valor: item.valor, quantidade: item.quantidade, ativo: item.ativo }),
            }
          );
        }
        setSalvoPool(true);
        setTimeout(() => setSalvoPool(false), 2500);
      } catch {
        setErroPool("Erro ao salvar pool.");
      }
    });
  }

  function resetarPool() {
    startReset(async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pools/resetar`, {
          method: "POST",
          credentials: "include",
          headers: { "x-tenant-id": tenantId },
        });
        setResetado(true);
        setTimeout(() => setResetado(false), 2500);
      } catch {
        setErroPool("Erro ao resetar pool.");
      }
    });
  }

  function salvarConfig() {
    setErroConfig("");
    setSalvoConfig(false);
    startConfig(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json", "x-tenant-id": tenantId },
          body: JSON.stringify({ multiplicadorPontos: config.multiplicadorPontos }),
        });
        if (!res.ok) throw new Error();
        atualizarTenant({ multiplicadorPontos: config.multiplicadorPontos });
        setSalvoConfig(true);
        setTimeout(() => setSalvoConfig(false), 2500);
      } catch {
        setErroConfig("Erro ao salvar.");
      }
    });
  }

  const janelaAberta = janelas.some((j) => j.aberta);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        titulo={`Configuração de ${nomePool}`}
        descricao={`Defina os prêmios da roleta e gerencie as janelas de troca.`}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Coluna principal ─────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">

          {/* ── Seção: Pool de Coins ──────────────────────────────────────── */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">

            {/* Header da seção */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 text-base">
                  <Zap size={16} style={{ color: corPrimaria }} />
                  {nomeMoeda} Especiais
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Configure prêmios com valor maior que 1. O sistema completa o restante com {nomeMoeda} de 1 automaticamente.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={resetarPool}
                  disabled={isPendingReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={12} className={isPendingReset ? "animate-spin" : ""} />
                  {resetado ? "Resetado!" : "Resetar Agora"}
                </button>
                <button
                  onClick={adicionarItem}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: corPrimaria }}
                >
                  <Plus size={13} />
                  Novo Tipo
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Card automático read-only */}
              <div
                className="rounded-xl p-4 border-2 border-dashed flex items-center gap-4"
                style={{ borderColor: `${corPrimaria}40`, backgroundColor: `${corPrimaria}08` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: corPrimaria }}
                >
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {nomeMoeda} Padrão
                    </p>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: corPrimaria }}
                    >
                      Automático
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Gerado automaticamente para completar o pool diário
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{coinsPadrao}</p>
                  <p className="text-xs text-zinc-400">unidades/dia</p>
                </div>
              </div>

              {/* Grid de coins especiais */}
              {pool.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <Sparkles size={24} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                  <p className="text-sm text-zinc-400">Nenhum coin especial ainda</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Adicione prêmios com valor maior que 1 para tornar a roleta mais interessante
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pool.map((item) => (
                    <CardCoinEspecial
                      key={item.id}
                      item={item}
                      corPrimaria={corPrimaria}
                      nomeMoeda={nomeMoeda}
                      multiplicador={config.multiplicadorPontos}
                      onAtualizar={atualizarItem}
                      onRemover={removerItem}
                    />
                  ))}
                </div>
              )}

              {/* Resumo do pool */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: "Total/dia", valor: totalGirosDia, sub: `${config.membrosAtivos} jogadores × ${config.metasPorDia} metas` },
                  { label: "Especiais", valor: totalEspeciais, sub: `${pool.filter((i) => i.ativo).length} tipos configurados` },
                  { label: "Padrão", valor: coinsPadrao, sub: `gerados automaticamente`, primary: true },
                ].map((s) => (
                  <div key={s.label} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-zinc-400 mb-1">{s.label}</p>
                    <p
                      className="text-2xl font-bold"
                      style={s.primary ? { color: corPrimaria } : undefined}
                    >
                      {!s.primary && <span className="text-zinc-800 dark:text-zinc-100">{s.valor}</span>}
                      {s.primary && s.valor}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{s.sub}</p>
                  </div>
                ))}
              </div>

              {erroPool && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">{erroPool}</p>
              )}

              <button
                onClick={salvarPool}
                disabled={isPendingPool}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: corPrimaria }}
              >
                {isPendingPool ? "Salvando..." : salvoPool ? "✓ Pool salvo!" : `Salvar ${nomePool}`}
              </button>
            </div>
          </section>

          {/* ── Seção: Janelas de Troca ───────────────────────────────────── */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2 text-base">
                  <Calendar size={16} style={{ color: corPrimaria }} />
                  Janelas de Troca
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Marketplace está{" "}
                  <span className={janelaAberta ? "text-emerald-400 font-medium" : "text-zinc-500 font-medium"}>
                    {janelaAberta ? "aberto" : "fechado"}
                  </span>{" "}
                  para resgates
                </p>
              </div>
              <button
                onClick={() =>
                  setJanelas((prev) => [
                    ...prev,
                    { id: gerarId(), tipo: "MANUAL", aberta: false, dataInicio: null, dataFim: null, label: "Nova Janela" },
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white hover:opacity-80 transition-opacity flex-shrink-0"
                style={{ backgroundColor: corPrimaria }}
              >
                <Plus size={13} />
                Nova Janela
              </button>
            </div>

            <div className="p-6">
              {janelas.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">Nenhuma janela configurada.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {janelas.map((j) => (
                    <CardJanela
                      key={j.id}
                      janela={j}
                      corPrimaria={corPrimaria}
                      onAtualizar={(id, dados) =>
                        setJanelas((prev) => prev.map((x) => (x.id === id ? { ...x, ...dados } : x)))
                      }
                      onRemover={(id) => setJanelas((prev) => prev.filter((x) => x.id !== id))}
                    />
                  ))}
                </div>
              )}
              <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-4">
                <Info size={10} />
                Janelas serão sincronizadas com o backend em breve.
              </p>
            </div>
          </section>
        </div>

        {/* ── Coluna direita: Config ────────────────────────────────────────── */}
        <div>
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden sticky top-4">
            <div className="px-5 py-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <Settings size={15} style={{ color: corPrimaria }} />
                Configurações Gerais
              </h2>
            </div>

            <div className="p-5 space-y-5">
              <Campo label="Metas por funcionário/dia">
                <input
                  type="number"
                  min={1}
                  value={config.metasPorDia}
                  onChange={(e) => setConfig((c) => ({ ...c, metasPorDia: Math.max(1, Number(e.target.value)) }))}
                  className={inputCls}
                />
              </Campo>

              <Campo label="Taxa de margem (%)">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={config.taxaMargem}
                    onChange={(e) => setConfig((c) => ({ ...c, taxaMargem: Math.max(0, Number(e.target.value)) }))}
                    className={inputCls}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">%</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Buffer de segurança: +{Math.ceil(config.metasPorDia * config.membrosAtivos * config.taxaMargem / 100)} unidades extras
                </p>
              </Campo>

              <Campo label={`Multiplicador de ${nomePontos}`}>
                <div className="relative">
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={config.multiplicadorPontos}
                    onChange={(e) => setConfig((c) => ({ ...c, multiplicadorPontos: Math.max(0.1, Number(e.target.value)) }))}
                    className={inputCls}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">×</span>
                </div>
              </Campo>

              {/* Preview conversão */}
              <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Preview de conversão</p>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {/* Coin padrão */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-400 flex items-center justify-center text-white text-[10px] font-bold">1</div>
                      <span className="text-xs text-zinc-500">1 {nomeMoeda}</span>
                    </div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      {config.multiplicadorPontos} {nomePontos}
                    </span>
                  </div>
                  {pool.filter((i) => i.ativo).slice(0, 5).map((i) => {
                    const cor = corCoin(i.valor);
                    return (
                      <div key={i.id} className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: cor.bg }}
                          >
                            {i.valor}
                          </div>
                          <span className="text-xs text-zinc-500 truncate max-w-[80px]">{i.nome}</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                          {(i.valor * config.multiplicadorPontos).toFixed(0)} {nomePontos}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Membros ativos */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                <div>
                  <p className="text-xs text-zinc-400">Membros ativos</p>
                  <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">{config.membrosAtivos}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Pool mínimo</p>
                  <p className="text-2xl font-bold mt-0.5" style={{ color: corPrimaria }}>
                    {totalGirosDia}
                  </p>
                </div>
              </div>

              {erroConfig && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">{erroConfig}</p>
              )}

              <button
                onClick={salvarConfig}
                disabled={isPendingConfig}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: corPrimaria }}
              >
                {isPendingConfig ? "Salvando..." : salvoConfig ? "✓ Salvo!" : "Salvar Configurações"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}