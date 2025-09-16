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
  onSquareClick: (toRow: number, toCol: number, from?: { row: number; col: number }) => void;
  invalidMoveFrom: { row: number; col: number } | null;
  validMoves: { row: number; col: number }[];
  selectedSquare: { row: number; col: number } | null;
}

export default function Chessboard({ board, turn, onSquareClick, lastMove, invalidMoveFrom, validMoves, selectedSquare }: ChessboardProps) {
  const [draggedPiece, setDraggedPiece] = useState<{ row: number; col: number; piece: Piece } | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, row: number, col: number, piece: Piece) => {
    if (piece.color !== turn) {
      e.preventDefault();
      return;
    }
    onSquareClick(row, col); // Show valid moves on drag start
    setDraggedPiece({ row, col, piece });
    e.dataTransfer.effectAllowed = 'move';
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (row: number, col: number) => {
    if (draggedPiece) {
      onSquareClick(row, col, { row: draggedPiece.row, col: draggedPiece.col });
      setDraggedPiece(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, row: number, col: number, piece: Piece) => {
    if (piece.color !== turn) {
      return;
    }
    onSquareClick(row, col); // Show valid moves on touch start
    setDraggedPiece({ row, col, piece });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedPiece) {
      e.preventDefault(); // Block screen scrolling
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedPiece) {
      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const square = dropTarget?.closest('[data-row-index][data-col-index]');

      if (square) {
        const toRow = parseInt(square.getAttribute('data-row-index')!, 10);
        const toCol = parseInt(square.getAttribute('data-col-index')!, 10);
        if (!isNaN(toRow) && !isNaN(toCol)) {
          onSquareClick(toRow, toCol, { row: draggedPiece.row, col: draggedPiece.col });
        }
      }
      setDraggedPiece(null);
    }
  };


  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="relative aspect-square w-full max-w-[calc(100vh-11rem)] mx-auto shadow-2xl rounded-lg overflow-hidden" 
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid grid-cols-8 grid-rows-8 h-full">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 !== 0;
            const isLastMoveFrom = lastMove?.from.row === rowIndex && lastMove?.from.col === colIndex;
            const isLastMoveTo = lastMove?.to.row === rowIndex && lastMove?.to.col === colIndex;
            const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
            const isInvalidMove = invalidMoveFrom?.row === rowIndex && invalidMoveFrom?.col === colIndex;
            const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-row-index={rowIndex}
                data-col-index={colIndex}
                className={cn(
                  "relative flex items-center justify-center aspect-square transition-colors duration-300",
                  isLight ? "bg-stone-300" : "bg-emerald-800",
                  (isLastMoveFrom || isLastMoveTo) && "bg-yellow-400/80",
                  isSelected && "bg-accent/90",
                  isInvalidMove && "bg-destructive/70"
                )}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(rowIndex, colIndex)}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                onTouchStart={(e) => {
                  const currentPiece = board[rowIndex][colIndex];
                  if (currentPiece) {
                    handleTouchStart(e, rowIndex, colIndex, currentPiece);
                  } else {
                    onSquareClick(rowIndex, colIndex);
                  }
                }}
              >
                {piece && (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, rowIndex, colIndex, piece)}
                    className={cn(
                      "cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center transition-transform duration-200 ease-in-out",
                       (draggedPiece?.row === rowIndex && draggedPiece?.col === colIndex) ? 'opacity-50' : 'opacity-100'
                    )}
                  >
                    {getPieceComponent(piece.type, piece.color)}
                  </div>
                )}
                {isValidMove && (
                   <div className="absolute w-full h-full flex items-center justify-center pointer-events-none animate-in fade-in-0 zoom-in-50 duration-300">
                    <div className="w-1/3 h-1/3 rounded-full bg-black/20"></div>
                  </div>
                )}
                {colIndex === 0 && (
                  <span className={cn("absolute left-1 top-0 text-xs font-bold transition-colors duration-300", isLight ? "text-emerald-800" : "text-stone-300")}>{ranks[rowIndex]}</span>
                )}
                {rowIndex === 7 && (
                  <span className={cn("absolute right-1 bottom-0 text-xs font-bold transition-colors duration-300", isLight ? "text-emerald-800" : "text-stone-300")}>{files[colIndex]}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
