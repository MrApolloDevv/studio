"use client";

import { useState } from "react";
import { type Piece, type Board, type PlayerColor } from "@/lib/chess-logic";
import { getPieceComponent } from "@/components/icons/ChessPieces";
import { cn } from "@/lib/utils";

type Move = {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

interface ChessboardProps {
  board: Board;
  turn: PlayerColor;
  lastMove: Move | null;
  onMove: (from: { row: number; col: number }, to: { row: number; col: number }) => void;
}

export default function Chessboard({ board, turn, onMove, lastMove }: ChessboardProps) {
  const [draggedPiece, setDraggedPiece] = useState<{ row: number; col: number; piece: Piece } | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, row: number, col: number, piece: Piece) => {
    if (piece.color !== turn) {
      e.preventDefault();
      return;
    }
    setDraggedPiece({ row, col, piece });
    e.dataTransfer.effectAllowed = 'move';
    // Use a transparent image to hide the default drag ghost
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (row: number, col: number) => {
    if (draggedPiece) {
      onMove({ row: draggedPiece.row, col: draggedPiece.col }, { row, col });
      setDraggedPiece(null);
      setSelectedSquare(null);
    }
  };

  const handleClick = (row: number, col: number, piece: Piece | null) => {
    if (selectedSquare) {
       onMove(selectedSquare, { row, col });
       setSelectedSquare(null);
    } else if (piece && piece.color === turn) {
      setSelectedSquare({ row, col });
    }
  }

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="relative aspect-square w-full max-w-[calc(100vh-8rem)] mx-auto shadow-2xl rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 grid-rows-8 h-full">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 !== 0;
            const isLastMoveFrom = lastMove?.from.row === rowIndex && lastMove?.from.col === colIndex;
            const isLastMoveTo = lastMove?.to.row === rowIndex && lastMove?.to.col === colIndex;
            const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "relative flex items-center justify-center aspect-square",
                  isLight ? "bg-stone-300" : "bg-emerald-800",
                  (isLastMoveFrom || isLastMoveTo) && "bg-accent/70",
                  isSelected && "bg-accent/90"
                )}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(rowIndex, colIndex)}
                onClick={() => handleClick(rowIndex, colIndex, piece)}
              >
                {piece && (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, rowIndex, colIndex, piece)}
                    className="cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center transition-transform duration-100 ease-in-out"
                    style={{ transform: (draggedPiece?.row === rowIndex && draggedPiece?.col === colIndex) ? 'scale(1.2)' : 'scale(1)'}}
                  >
                    {getPieceComponent(piece.type, piece.color)}
                  </div>
                )}
                {colIndex === 0 && (
                  <span className={cn("absolute left-1 top-0 text-xs font-bold", isLight ? "text-black" : "text-stone-300")}>{ranks[rowIndex]}</span>
                )}
                {rowIndex === 7 && (
                  <span className={cn("absolute right-1 bottom-0 text-xs font-bold", isLight ? "text-black" : "text-stone-300")}>{files[colIndex]}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
