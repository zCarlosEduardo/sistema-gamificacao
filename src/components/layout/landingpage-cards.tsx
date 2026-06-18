"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------
   COUNT UP HOOK (FIXED)
----------------------------*/
function useCountUp(end: number, duration = 1500, trigger = false) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!trigger) return;
    if (startedRef.current) return;

    startedRef.current = true;

    let frame: number;
    let startTime: number;

    setCount(0);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [trigger, end, duration]);

  return count;
}

/* ---------------------------
   IN VIEW HOOK
----------------------------*/
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

/* ---------------------------
   HERO CARD
----------------------------*/
export function HeroCard() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const coins = useCountUp(1240, 1500, inView);
  const pontos = useCountUp(3680, 1500, inView);
  const progresso = useCountUp(72, 1500, inView);
  const giros = useCountUp(3, 1500, inView);

  return (
    <div
      ref={ref}
      className="bg-(--color-bg-subtle)/40 rounded-lg p-4 border border-(--color-border) w-full shadow-xl/30 "
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* COINS */}
        <div className="bg-(--color-bg-subtle) p-2 rounded-lg border border-(--color-border) ">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-amber-400 rounded-full animate-pulse" />
            <h3 className="text-sm text-(--color-text-muted)">Coins</h3>
          </div>

          <div className="mt-2 text-2xl font-bold text-amber-500">
            {coins.toLocaleString("pt-BR")}
          </div>
        </div>

        {/* PONTOS */}
        <div className="bg-(--color-bg-subtle) p-4 rounded-lg border border-(--color-border)">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-violet-600 rounded-full animate-pulse" />
            <h3 className="text-sm text-(--color-text-muted)">Pontos</h3>
          </div>

          <div className="mt-2 text-2xl font-bold text-(--color-primary-light)">
            {pontos.toLocaleString("pt-BR")}
          </div>
        </div>

        {/* PROGRESSO */}
        <div className="bg-(--color-bg-subtle) p-4 rounded-lg border border-(--color-border) sm:col-span-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold">Meta: Vendas Q2</span>
            <span className="text-sm font-bold text-(--color-primary-light)">
              {progresso}%
            </span>
          </div>

          <div className="h-3 w-full bg-(--color-border) rounded-full overflow-hidden">
            <div
              className="h-full bg-(--color-primary) rounded-full"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* GIROS */}
        <div className="bg-(--color-bg-subtle) p-4 rounded-lg border border-(--color-border) sm:col-span-2">
          <p className="text-lg font-bold">
            <span className="text-2xl text-(--color-primary-light)">
              {giros.toLocaleString("pt-BR")}
            </span>{" "}
            giros disponíveis
          </p>

          <p className="text-sm text-(--color-text-muted)">
            Gire a roleta e ganhe coins extras.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   STATS SECTION
----------------------------*/
export function StatsSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  const usuarios = useCountUp(48, 1500, inView);
  const metas = useCountUp(12000, 1500, inView);
  const engajamento = useCountUp(94, 1500, inView);

  const stats = [
    { count: usuarios, label: "Empresas ativas" },
    { count: metas, label: "Metas batidas" },
    {
      count: engajamento,
      suffix: "%",
      label: "Engajamento médio",
      highlight: true,
    },
  ];

  function formatNumber(value: number) {
    if (value < 1000) return value.toString();
    if (value < 1_000_000) return `${Math.floor(value / 1000)}k`;
    if (value < 1_000_000_000)
      return `${(value / 1_000_000).toFixed(1).replace(".0", "")}M`;
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  return (
    <section ref={ref}>
      <div className="rounded-3xl border bg-(--color-bg-subtle) border-(--color-border) ">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`
                flex flex-col items-center justify-center py-6 
                ${
                  index !== stats.length - 1
                    ? "border-b md:border-b-0 md:border-r border-(--color-border)"
                    : ""
                }
              `}
            >
              <h3
                className={`text-3xl font-bold ${
                  item.highlight ? "text-violet-500" : "text-white"
                }`}
              >
                {formatNumber(item.count)}
                {item.suffix ?? ""}
              </h3>

              <p className="mt-3 text-sm text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
