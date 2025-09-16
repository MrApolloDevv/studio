"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PartyPopper, Frown } from 'lucide-react';
import Link from "next/link";

interface GameOverDialogProps {
  isOpen: boolean;
  message: string;
  onNewGame: () => void;
}

export default function GameOverDialog({ isOpen, message, onNewGame }: GameOverDialogProps) {
  const isWin = message.includes("Você venceu");

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            {isWin ? (
              <PartyPopper className="w-16 h-16 text-green-500" />
            ) : (
              <Frown className="w-16 h-16 text-red-500" />
            )}
          </div>
          <AlertDialogTitle className="text-center text-2xl">{message}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Obrigado por jogar!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel asChild>
            <Link href="/">Voltar ao Menu</Link>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onNewGame}>
            Jogar Novamente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
