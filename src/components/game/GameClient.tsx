"use client";

import { useState, useEffect } from "react";
import { Crown, User, Settings } from "lucide-react";
import Chessboard from "./Chessboard";
import MoveHistory from "./MoveHistory";
import Chat from "@/components/chat/Chat";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  initialBoard,
  boardToFEN,
  algebraicToCoords,
  coordsToAlgebraic,
  isMoveValid,
  type Board,
  type PlayerColor,
  type Piece,
} from "@/lib/chess-logic";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    const piece = board[from.row][from.col];
    if (turn !== 'w' || !piece || piece.color !== 'w' || !isMoveValid(board, from, to)) {
      toast({
        variant: "destructive",
        title: "Movimento Inválido",
        description: "Esta jogada não é permitida.",
      });
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    const moveNotation = coordsToAlgebraic(to.row, to.col);
    
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
        const fenString = boardToFEN(board, turn, fullMoveNumber);
        const response = await fetch('/api/bestmove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fen: fenString }),
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        const result = await response.json();

        if (result && result.bestMove && result.bestMove.includes('-')) {
          const [fromAlg, toAlg] = result.bestMove.split('-');
          const from = algebraicToCoords(fromAlg);
          const to = algebraicToCoords(toAlg);
          
          if (from && to && isMoveValid(board, from, to)) {
              const piece = board[from.row][from.col];
              if (piece && piece.color === turn) {
                const newBoard = board.map(row => [...row]);
                newBoard[to.row][to.col] = piece;
                newBoard[from.row][from.col] = null;

                const moveNotation = coordsToAlgebraic(to.row, to.col);
                
                setBoard(newBoard);
                setLastMove({from, to});
                setMoveHistory(prev => [...prev, moveNotation]);
                
                const nextTurn = turn === "w" ? "b" : "w";
                setTurn(nextTurn);

                if (nextTurn === 'w') {
                  setFullMoveNumber(prev => prev + 1);
                }
              } else {
                 console.error("Jogada da IA inválida (peça errada), tentando novamente:", result.bestMove);
                 makeOpponentMove();
              }
          } else {
             console.error("Jogada da IA inválida recebida, tentando novamente:", result.bestMove);
             makeOpponentMove();
          }
        } else {
            console.error("Jogada da IA inválida recebida:", result.bestMove);
            toast({
              variant: "destructive",
              title: "Erro da IA do Oponente",
              description: "A IA retornou uma jogada inválida. Por favor, tente novamente.",
            });
            setTurn('w'); // Devolve o turno ao jogador para evitar loop
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
    <div className="bg-background h-screen flex flex-col dark">
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
          
          <div className="flex flex-col items-center justify-center">
             <Chessboard board={board} turn={turn} onMove={handleMove} lastMove={lastMove} />
          </div>
          
          <div className="flex flex-col gap-4 overflow-hidden">
            <Card>
                <CardContent className="flex items-center justify-center p-4 gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/2/100/100" data-ai-hint="person face" />
                            <AvatarFallback>O</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">Oponente</span>
                    </div>
                    <span className="text-muted-foreground font-bold text-lg">vs</span>
                    <div className="flex flex-col items-center gap-2">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/1/100/100" data-ai-hint="person face" />
                            <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">Você</span>
                    </div>
                </CardContent>
            </Card>
            <MoveHistory moves={moveHistory} />
            <Chat />
          </div>

        </div>
      </main>
    </div>
  );
}
