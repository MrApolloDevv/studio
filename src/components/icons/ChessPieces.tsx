"use client";

import Image from 'next/image';
import { type PieceSymbol, type PlayerColor } from "@/lib/chess-logic";

const pieceImages: { [key in PlayerColor]: { [key in PieceSymbol]: string } } = {
  w: {
    K: '/pieces/wK.svg',
    Q: '/pieces/wQ.svg',
    R: '/pieces/wR.svg',
    B: '/pieces/wB.svg',
    N: '/pieces/wN.svg',
    P: '/pieces/wP.svg',
  },
  b: {
    K: '/pieces/bK.svg',
    Q: '/pieces/bQ.svg',
    R: '/pieces/bR.svg',
    B: '/pieces/bB.svg',
    N: '/pieces/bN.svg',
    P: '/pieces/bP.svg',
  },
};

export const getPieceComponent = (type: PieceSymbol, color: PlayerColor) => {
  const imageUrl = pieceImages[color][type];
  return <Image src={imageUrl} alt={`${color}${type}`} width={45} height={45} layout="responsive" />;
};
