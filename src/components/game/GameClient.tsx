"use client";

import { useState, useEffect } from "react";
import { Crown, User, Settings } from "lucide-react";
import Chessboard from "./Chessboard";
import PlayerProfile from "./PlayerProfile";
import MoveHistory from "./MoveHistory";
import Chat from "@/components/chat/Chat";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { suggestMove } from "@/ai/flows/suggest-move";
import {
  initialBoard,
  boardToFEN,
  algebraicToCoords,
  coordsToAlgebraic,
  isMoveValid,
  type Board,
  type PlayerColor,
} from "@/lib/chess-logic";

type Move = {
  from: { row: number; col: number };
  to: { row: number; col: number };
};

export default function GameClient() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<PlayerColor>("w");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [fullMoveNumber, setFullMoveNumber] = useState(1);
  const { toast } = useToast();

  const handleMove = (from: { row: number; col: number }, to: { row: number; col: number }) => {
    if (turn !== 'w' || !isMoveValid(board, from, to)) {
      toast({
        variant: "destructive",
        title: "Movimento Inválido",
        description: "Esta jogada não é permitida.",
      });
      return;
    }

    const piece = board[from.row][from.col];
    if (!piece || piece.color !== turn) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    const moveNotation = `${coordsToAlgebraic(from.row, from.col)}-${coordsToAlgebraic(to.row, to.col)}`;
    
    setBoard(newBoard);
    setLastMove({from, to});
    setMoveHistory(prev => [...prev, moveNotation]);
    
    const nextTurn = turn === "w" ? "b" : "w";
    setTurn(nextTurn);

    if (nextTurn === 'w') {
      setFullMoveNumber(prev => prev + 1);
    }
  };

  useEffect(() => {
    const makeOpponentMove = async () => {
      try {
        const result = await suggestMove({
          boardState: boardToFEN(board, turn, fullMoveNumber),
          difficulty: "medium",
        });

        if (result && result.move && result.move.includes('-')) {
          const [fromAlg, toAlg] = result.move.split('-');
          const from = algebraicToCoords(fromAlg);
          const to = algebraicToCoords(toAlg);
          
          if (from && to && isMoveValid(board, from, to)) {
              const piece = board[from.row][from.col];
              if (piece && piece.color === turn) {
                const newBoard = board.map(row => [...row]);
                newBoard[to.row][to.col] = piece;
                newBoard[from.row][from.col] = null;

                const moveNotation = `${coordsToAlgebraic(from.row, from.col)}-${coordsToAlgebraic(to.row, to.col)}`;
                
                setBoard(newBoard);
                setLastMove({from, to});
                setMoveHistory(prev => [...prev, moveNotation]);
                
                const nextTurn = turn === "w" ? "b" : "w";
                setTurn(nextTurn);

                if (nextTurn === 'w') {
                  setFullMoveNumber(prev => prev + 1);
                }
              } else {
                 console.error("Jogada da IA inválida (peça errada), tentando novamente:", result.move);
                 makeOpponentMove();
              }
          } else {
             console.error("Jogada da IA inválida recebida, tentando novamente:", result.move);
             makeOpponentMove();
          }
        } else {
            console.error("Jogada da IA inválida recebida:", result.move);
            makeOpponentMove();
        }
      } catch (error) {
        console.error("Erro ao obter a jogada do oponente:", error);
        toast({
          variant: "destructive",
          title: "Erro da IA do Oponente",
          description: "Não foi possível obter a jogada do oponente. Por favor, tente novamente.",
        });
        setTurn('w');
      }
    };

    if (turn === 'b') {
      const timer = setTimeout(() => {
        makeOpponentMove();
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [turn, board, fullMoveNumber, toast]);

  return (
    <div className="bg-background h-screen flex flex-col">
      <header className="flex items-center justify-between p-2 border-b bg-card flex-shrink-0">
        <div className="flex items-center gap-2">
          <Crown className="text-accent h-6 w-6" />
          <h1 className="text-xl font-bold text-foreground">Arena de Xadrez</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <User />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
        </div>
      </header>
      <main className="flex-grow p-4 overflow-hidden">
        <div className="grid grid-cols-[1fr_minmax(280px,320px)] gap-4 h-full">
          
          <div className="flex flex-col gap-2">
            <PlayerProfile
              name="Oponente"
              elo={1250}
              avatarUrl="https://picsum.photos/seed/2/100/100"
              isTurn={turn === "b"}
              size="small"
            />
            <div className="flex-grow flex items-center justify-center">
              <Chessboard board={board} turn={turn} onMove={handleMove} lastMove={lastMove} />
            </div>
            <PlayerProfile
              name="Você"
              elo={1200}
              avatarUrl="https://picsum.photos/seed/1/100/100"
              isTurn={turn === "w"}
              size="small"
            />
          </div>
          
          <div className="flex flex-col gap-4 overflow-hidden">
            <MoveHistory moves={moveHistory} />
            <Chat />
          </div>

        </div>
      </main>
    </div>
  );
}
