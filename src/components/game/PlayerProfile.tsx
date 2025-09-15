"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface PlayerProfileProps {
  name: string;
  elo: number;
  avatarUrl: string;
  isTurn: boolean;
  size?: 'default' | 'small';
}

export default function PlayerProfile({ name, elo, avatarUrl, isTurn, size = 'default' }: PlayerProfileProps) {
  const isSmall = size === 'small';

  return (
    <Card className={cn("transition-all", isTurn && "border-accent shadow-lg")}>
      <CardContent className={cn("flex items-center justify-between gap-4", isSmall ? "p-2" : "p-4")}>
        <div className="flex items-center gap-3">
          <Avatar className={cn(isSmall ? "h-10 w-10" : "h-12 w-12", "border-2 border-primary/50")}>
            <AvatarImage src={avatarUrl} alt={name} data-ai-hint="person face" />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className={cn("font-semibold", isSmall ? "text-base" : "text-lg")}>{name}</h3>
            <Badge variant="secondary">Elo: {elo}</Badge>
          </div>
        </div>
        {isTurn && (
          <div className="flex items-center gap-2 text-accent animate-pulse">
            <Clock className="h-5 w-5" />
            <span className="font-semibold text-sm">Pensando...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
