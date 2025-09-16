
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface PlayerProfileProps {
  name: string;
  elo: number;
  avatarUrl: string;
  isTurn: boolean;
}

export default function PlayerProfile({ name, elo, avatarUrl, isTurn }: PlayerProfileProps) {

  return (
    <Card className={cn("transition-all w-full", isTurn && "border-accent shadow-lg")}>
      <CardContent className={cn("flex items-center justify-between gap-3 p-2 md:p-3")}>
        <div className="flex items-center gap-2 md:gap-3">
          <Avatar className={cn("h-8 w-8 md:h-10 md:w-10", "border-2 border-primary/50")}>
            <AvatarImage src={avatarUrl} alt={name} data-ai-hint="person face" />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className={cn("font-semibold", "text-sm md:text-base")}>{name}</h3>
            <span className="text-xs text-muted-foreground">Elo: {elo}</span>
          </div>
        </div>
        {isTurn && (
          <div className="flex items-center gap-2 text-accent animate-pulse">
            <Clock className="h-4 w-4" />
            <span className="font-semibold text-xs hidden md:inline">Pensando...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
