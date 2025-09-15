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
  type Piece
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
    if (!isMoveValid(board, from, to)) {
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
          difficulty: "medium", // A dificuldade do oponente pode ser ajustada aqui
        });

        if (result && result.move && result.move.includes('-')) {
          const [fromAlg, toAlg] = result.move.split('-');
          const from = algebraicToCoords(fromAlg);
          const to = algebraicToCoords(toAlg);
          
          if (from && to && isMoveValid(board, from, to)) {
            handleMove(from, to);
          } else {
             // Se a jogada da IA for inválida, tente novamente
             console.error("Jogada da IA inválida recebida, tentando novamente:", result.move);
             makeOpponentMove();
          }
        } else {
            console.error("Jogada da IA inválida recebida:", result.move);
            toast({
              variant: "destructive",
              title: "Erro da IA do Oponente",
              description: "A IA retornou uma jogada inválida. Tente novamente.",
            });
            setTurn('w'); // Reverter o turno se a IA falhar de forma previsível
        }
      } catch (error) {
        console.error("Erro ao obter a jogada do oponente:", error);
        toast({
          variant: "destructive",
          title: "Erro da IA do Oponente",
          description: "Não foi possível obter a jogada do oponente. Por favor, tente novamente.",
        });
        // Reverter o turno se a IA falhar
        setTurn('w');
      }
    };

    if (turn === 'b') {
      // Atraso para simular o tempo de raciocínio do oponente
      const timer = setTimeout(() => {
        makeOpponentMove();
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [turn, board, fullMoveNumber]);

  const fen = boardToFEN(board, turn, fullMoveNumber);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Crown className="text-accent h-6 w-6" />
          <h1 className="text-xl font-bold text-foreground">Arena de Xadrez em Tempo Real</h1>
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
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 max-w-7xl mx-auto">
          
          <div className="flex flex-col gap-4">
            <PlayerProfile
              name="Oponente"
              elo={1250}
              avatarUrl="https://picsum.photos/seed/2/100/100"
              isTurn={turn === "b"}
              size="small"
            />
            <Chessboard board={board} turn={turn} onMove={handleMove} lastMove={lastMove} />
            <PlayerProfile
              name="Você"
              elo={1200}
              avatarUrl="https://picsum.photos/seed/1/100/100"
              isTurn={turn === "w"}
              size="small"
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <MoveHistory moves={moveHistory} />
            <Chat />
          </div>

        </div>
      </main>
    </div>
  );
}
