"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";

interface MoveHistoryProps {
  moves: string[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <Card className="flex-grow flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-md">
          <History />
          Histórico de Jogadas
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-40 md:h-full w-full pr-4">
          <ol className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 text-sm">
            {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
              <li key={i} className="contents">
                <div className="text-muted-foreground">{i + 1}.</div>
                <div className="font-mono">{moves[i * 2]}</div>
                <div className="font-mono">{moves[i * 2 + 1] || ""}</div>
              </li>
            ))}
          </ol>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
