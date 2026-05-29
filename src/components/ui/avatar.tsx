"use client";

import { AvatarProps } from "@/components/types"

function getIniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

/**
 * Avatar circular com iniciais ou imagem.
 *
 * @example
 * <Avatar nome="João Silva" cor={corAtual} />
 * <Avatar nome="João Silva" imagem={usuario.image} cor={corAtual} size="lg" />
 */
export function Avatar({ nome, imagem, cor, corSecundaria, size = "md" }: AvatarProps) {
  const background = corSecundaria
    ? `linear-gradient(135deg, ${cor}, ${corSecundaria})`
    : cor;

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden`}
      style={{ background }}
    >
      {imagem ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imagem} alt={nome} className="w-full h-full object-cover" />
      ) : (
        getIniciais(nome)
      )}
    </div>
  );
}