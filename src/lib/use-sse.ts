"use client";

import { useEffect, useState, useCallback } from "react";

interface SSEOptions {
  url: string;
  onEvent?: (event: { type: string; data: any }) => void;
}

export function useSSE({ url, onEvent }: SSEOptions) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
    const eventSource = new EventSource(`${apiUrl}${url}`, {
      withCredentials: true,
    });

    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent?.({ type: e.type, data });
      } catch {}
    };

    // Escuta eventos tipados
    const tipos = [
      "META_APROVADA",
      "ROLETA_GIRADA",
      "RESGATE_REJEITADO",
      "RESGATE_APROVADO",
      "SALDO_ATUALIZADO",
    ];

    tipos.forEach((tipo) => {
      eventSource.addEventListener(tipo, (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data);
          onEvent?.({ type: tipo, data });
        } catch {}
      });
    });

    return () => eventSource.close();
  }, [url, onEvent]);

  return { connected };
}