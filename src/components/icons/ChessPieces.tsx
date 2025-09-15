"use client";

import { type PieceSymbol, type PlayerColor } from "@/lib/chess-logic";

const pieceColorClass = {
  w: "fill-white stroke-black",
  b: "fill-green-800 stroke-green-100",
};

const King = ({ color }: { color: PlayerColor }) => (
  <svg viewBox="0 0 45 45" className={`w-full h-full ${pieceColorClass[color]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,0)">
      <path d="M 22.5,11.63 L 22.5,6" strokeWidth="2" />
      <path d="M 20,8 L 25,8" strokeWidth="2" />
      <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="none" />
      <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,32 C 32.5,32 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,25 L 20,16 C 15.5,13 6.5,19.5 9.5,32 L 11.5,32 Z" />
    </g>
  </svg>
);

const Queen = ({ color }: { color: PlayerColor }) => (
  <svg viewBox="0 0 45 45" className={`w-full h-full ${pieceColorClass[color]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,0)">
      <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,32 C 32.5,32 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,25 L 20,16 C 15.5,13 6.5,19.5 9.5,32 L 11.5,32 Z" />
      <path d="M 12,12 L 33,12 L 22.5,25 L 12,12 Z" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="12" cy="9" r="2" />
      <circle cx="22.5" cy="8" r="2" />
      <circle cx="33" cy="9" r="2" />
      <circle cx="39" cy="12" r="2" />
    </g>
  </svg>
);

const Rook = ({ color }: { color: PlayerColor }) => (
  <svg viewBox="0 0 45 45" className={`w-full h-full ${pieceColorClass[color]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,0)">
      <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 Z" />
      <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 Z" />
      <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14" />
      <path d="M 11,14 L 34,14 L 31,32 L 14,32 L 11,14 Z" />
    </g>
  </svg>
);

const Bishop = ({ color }: { color: PlayerColor }) => (
  <svg viewBox="0 0 45 45" className={`w-full h-full ${pieceColorClass[color]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,0)">
      <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.26,39.99 36,40 C 32.61,40.97 25.89,38.57 22.5,38 C 19.11,38.57 12.39,40.97 9,40 C 7.74,39.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 Z" />
      <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 27.5,26 24.5,24.5 22.5,24.5 C 20.5,24.5 17.5,26 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 Z" />
      <path d="M 25,28 L 22.5,24.5 L 20,28" />
      <path d="M 22.5,15.5 C 22.5,15.5 22.5,14 22.5,12.5 C 22.5,11 24,10 24.5,10 C 25,10 25.5,10.5 25.5,11.5 C 25.5,12.5 25.5,13.5 25.5,13.5" />
      <circle cx="22.5" cy="10" r="1.5" />
    </g>
  </svg>
);

const Knight = ({ color }: { color: PlayerColor }) => (
  <svg viewBox="0 0 45 45" className={`w-full h-full ${pieceColorClass[color]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,0)">
      <path d="M 22,10 C 22.74,9.26 24.26,8.26 25.5,8 C 29.5,8 34,11 34,11 C 34,11 33.5,15.5 31,18 C 30,18.5 28.5,18.5 27.5,19 C 24.5,20.5 22,23 22,23 C 22,23 23.5,29.5 22,31 C 21.5,31.5 19.5,32.5 19.5,32.5 C 19.5,32.5 18.5,38.5 16,39 C 12,39.5 11,36 11,36 C 11,36 12,31.5 12.5,30 C 13,28.5 18,29 18,29 C 18,29 15,24.5 17.5,22 C 20,19.5 23.5,18 23.5,18" />
      <circle cx="25" cy="14" r="1" />
    </g>
  </svg>
);

const Pawn = ({ color }: { color: PlayerColor }) => (
  <svg viewBox="0 0 45 45" className={`w-full h-full ${pieceColorClass[color]}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,0)">
      <path d="M 22.5,39 C 25.5,39 28.5,36 28.5,33 C 28.5,30 25.5,27 22.5,27 C 19.5,27 16.5,30 16.5,33 C 16.5,36 19.5,39 22.5,39 Z" />
      <path d="M 22.5,27 C 22.5,24 22.5,21 22.5,18" />
      <path d="M 22.5,18 C 25.5,18 25.5,15 22.5,15 C 19.5,15 19.5,18 22.5,18 Z" />
    </g>
  </svg>
);

const pieceMap = {
  K: King,
  Q: Queen,
  R: Rook,
  B: Bishop,
  N: Knight,
  P: Pawn,
};

export const getPieceComponent = (type: PieceSymbol, color: PlayerColor) => {
  const PieceComponent = pieceMap[type];
  return <PieceComponent color={color} />;
};
