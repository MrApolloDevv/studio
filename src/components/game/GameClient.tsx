
"use client";

import { useState, useEffect, useRef } from "react";
import { Crown, Settings, Menu } from "lucide-react";
import Chessboard from "./Chessboard";
import MoveHistory from "./MoveHistory";
import GameOverDialog from "./GameOverDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  initialBoard,
  boardToFEN,
  algebraicToCoords,
  coordsToAlgebraic,
  isMoveValid,
  getValidMoves,
  isCheckmate,
  isStalemate,
  type Board,
  type PlayerColor,
  type Piece,
} from "@/lib/chess-logic";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PlayerProfile from "./PlayerProfile";

type Move = {
  from: { row: number; col: number };
  to: { row: number; col: number };
};

export default function GameClient() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<PlayerColor>("w");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [invalidMoveFrom, setInvalidMoveFrom] = useState<{ row: number; col: number } | null>(null);
  const [fullMoveNumber, setFullMoveNumber] = useState(1);
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [gameOver, setGameOver] = useState<string | null>(null);
  const { toast } = useToast();

  const moveAudioRef = useRef<HTMLAudioElement | null>(null);
  const checkAudioRef = useRef<HTMLAudioElement | null>(null);
  const isAudioInitialized = useRef(false);

  useEffect(() => {
    moveAudioRef.current = new Audio('/sounds/move-sound.mp3');
    checkAudioRef.current = new Audio('/sounds/check-sound.mp3');
  }, []);

  const playSound = (sound: 'move' | 'check') => {
    const audioRef = sound === 'move' ? moveAudioRef : checkAudioRef;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };
  
  const initializeAudio = () => {
    if (!isAudioInitialized.current) {
        moveAudioRef.current?.load();
        checkAudioRef.current?.load();
        isAudioInitialized.current = true;
    }
  };

  const handleNewGame = () => {
    setBoard(initialBoard);
    setTurn('w');
    setMoveHistory([]);
    setLastMove(null);
    setFullMoveNumber(1);
    setSelectedSquare(null);
    setValidMoves([]);
    setGameOver(null);
  };

  const checkGameOver = (currentBoard: Board, nextTurn: PlayerColor) => {
    if (isCheckmate(currentBoard, nextTurn)) {
      setGameOver(nextTurn === 'w' ? 'Xeque-mate! Stockfish venceu.' : 'Xeque-mate! Você venceu!');
    } else if (isStalemate(currentBoard, nextTurn)) {
      setGameOver('Empate por Afogamento!');
    }
  };

  const handleSquareClick = (row: number, col: number, fromSquare?: { row: number; col: number }) => {
    if (turn !== 'w' || gameOver) return;
    
    initializeAudio();

    const from = fromSquare || selectedSquare;
    const to = { row, col };

    if (from) {
      const piece = board[from.row][from.col];
      const moveValidation = isMoveValid(board, from, to);

      if (piece && piece.color === 'w' && moveValidation.valid) {
        const newBoard = board.map(row => row.map(p => p ? {...p} : null));
        const movedPiece: Piece = { ...piece, hasMoved: true };
        
        if (piece.type === 'K' && Math.abs(to.col - from.col) === 2) {
          const isShortCastle = to.col > from.col;
          const rookCol = isShortCastle ? 7 : 0;
          const rookTargetCol = isShortCastle ? 5 : 3;
          const rook = newBoard[from.row][rookCol];

          newBoard[from.row][to.col] = movedPiece;
          newBoard[from.row][from.col] = null;
          if (rook) {
            newBoard[from.row][rookTargetCol] = { ...rook, hasMoved: true };
            newBoard[from.row][rookCol] = null;
          }
        } else {
          newBoard[to.row][to.col] = movedPiece;
          newBoard[from.row][from.col] = null;
        }

        const moveNotation = coordsToAlgebraic(to.row, to.col);
        
        setBoard(newBoard);
        setLastMove({from, to});
        setMoveHistory(prev => [...prev, moveNotation]);
        setSelectedSquare(null);
        setValidMoves([]);
        
        if (moveValidation.isCheck) {
          playSound('check');
        } else {
          playSound('move');
        }

        const nextTurn = turn === "w" ? "b" : "w";
        setTurn(nextTurn);

        checkGameOver(newBoard, nextTurn);

        if (nextTurn === 'w') {
          setFullMoveNumber(prev => prev + 1);
        }
      } else {
        const pieceAtClickedSquare = board[row][col];
        if (pieceAtClickedSquare && pieceAtClickedSquare.color === 'w') {
            setSelectedSquare({row, col});
            setValidMoves(getValidMoves(board, {row, col}));
        } else {
            setSelectedSquare(null);
            setValidMoves([]);
            if (from) {
                setInvalidMoveFrom(from);
                setTimeout(() => setInvalidMoveFrom(null), 300);
            }
        }
      }
    } else {
      const pieceAtClickedSquare = board[row][col];
      if (pieceAtClickedSquare && pieceAtClickedSquare.color === 'w') {
        setSelectedSquare({ row, col });
        setValidMoves(getValidMoves(board, { row, col }));
      }
    }
  };
  
  useEffect(() => {
    if (turn === 'b' && !gameOver) {
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

          if (result && result.bestMove && result.bestMove.length >= 4 && result.bestMove !== 'info') {
            const fromAlg = result.bestMove.substring(0, 2);
            const toAlg = result.bestMove.substring(2, 4);
            const from = algebraicToCoords(fromAlg);
            const to = algebraicToCoords(toAlg);
            
            if (from && to) {
                const piece = board[from.row][from.col];
                const moveValidation = isMoveValid(board, from, to);

                if (piece && piece.color === turn && moveValidation.valid) {
                  const newBoard = board.map(row => row.map(p => p ? {...p} : null));
                  const movedPiece: Piece = { ...piece, hasMoved: true };

                  if (piece.type === 'K' && Math.abs(to.col - from.col) === 2) {
                      const isShortCastle = to.col > from.col;
                      const rookCol = isShortCastle ? 7 : 0;
                      const rookTargetCol = isShortCastle ? 5 : 3;
                      const rook = newBoard[from.row][rookCol];

                      newBoard[from.row][to.col] = movedPiece;
                      newBoard[from.row][from.col] = null;
                      if (rook) {
                          newBoard[from.row][rookTargetCol] = { ...rook, hasMoved: true };
                          newBoard[from.row][rookCol] = null;
                      }
                  } else {
                      newBoard[to.row][to.col] = movedPiece;
                      newBoard[from.row][from.col] = null;
                  }

                  const moveNotation = coordsToAlgebraic(to.row, to.col);
                  
                  setBoard(newBoard);
                  setLastMove({from, to});
                  setMoveHistory(prev => [...prev, moveNotation]);
                  
                  if (moveValidation.isCheck) {
                    playSound('check');
                  } else {
                    playSound('move');
                  }
                  
                  const nextTurn = turn === "w" ? "b" : "w";
                  setTurn(nextTurn);
                  
                  checkGameOver(newBoard, nextTurn);

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
              setTurn('w'); 
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

      const timer = setTimeout(() => {
        makeOpponentMove();
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [turn, board, fullMoveNumber, toast, gameOver]);

  return (
    <div className="bg-background flex flex-col dark h-screen">
      <GameOverDialog isOpen={!!gameOver} message={gameOver || ''} onNewGame={handleNewGame} />
      <header className="flex items-center justify-between p-2 border-b bg-card flex-shrink-0">
        <div className="flex items-center gap-2">
          <Crown className="text-accent h-6 w-6" />
          <h1 className="text-xl font-bold text-foreground">Xadrez</h1>
        </div>
        <div className="flex items-center gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Opções do Jogo</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 pt-8 h-full">
                        <PlayerProfile name="Stockfish" elo={3000} avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRik8giQTf9hGDMvzYc2iNnBeQXzQ217Nu4Jg&s" isTurn={turn === 'b'} />
                        <PlayerProfile name="Você" elo={1400} avatarUrl="https://picsum.photos/seed/1/100/100" isTurn={turn === 'w'} />
                        <MoveHistory moves={moveHistory} />
                    </div>
                </SheetContent>
            </Sheet>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Settings />
          </Button>
        </div>
      </header>
      <main className="flex-grow p-2 md:p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(280px,320px)] gap-4 h-full">
          
          <div className="flex flex-col items-center justify-start md:justify-center pt-2 md:pt-0">
              <div className="w-full flex items-center justify-center">
                <Chessboard 
                  board={board} 
                  turn={turn} 
                  onSquareClick={handleSquareClick}
                  lastMove={lastMove} 
                  invalidMoveFrom={invalidMoveFrom}
                  validMoves={validMoves}
                  selectedSquare={selectedSquare}
                />
              </div>
              <div className="md:hidden flex w-full justify-around items-start gap-2 mt-2.5">
                <PlayerProfile name="Stockfish" elo={3000} avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRik8giQTf9hGDMvzYc2iNnBeQXzQ217Nu4Jg&s" isTurn={turn === 'b'} />
                <PlayerProfile name="Você" elo={1400} avatarUrl="https://picsum.photos/seed/1/100/100" isTurn={turn === 'w'} />
              </div>
          </div>
          
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-4">
              <PlayerProfile name="Stockfish" elo={3000} avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRik8giQTf9hGDMvzYc2iNnBeQXzQ217Nu4Jg&s" isTurn={turn === 'b'} />
              <PlayerProfile name="Você" elo={1400} avatarUrl="https://picsum.photos/seed/1/100/100" isTurn={turn === 'w'} />
            </div>
            <MoveHistory moves={moveHistory} />
          </div>

        </div>
      </main>
    </div>
  );
}
