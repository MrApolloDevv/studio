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
}

export default function PlayerProfile({ name, elo, avatarUrl, isTurn }: PlayerProfileProps) {
  return (
    <Card className={cn("transition-all", isTurn && "border-accent shadow-lg")}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/50">
            <AvatarImage src={avatarUrl} alt={name} data-ai-hint="person face" />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <Badge variant="secondary">Elo: {elo}</Badge>
          </div>
        </div>
        {isTurn && (
          <div className="flex items-center gap-2 text-accent animate-pulse">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Pensando...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
