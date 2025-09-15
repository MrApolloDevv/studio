"use client";

import { useState } from "react";
import { Lightbulb, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { suggestMove, SuggestMoveOutput } from "@/ai/flows/suggest-move";

interface MoveSuggestionProps {
  fen: string;
}

export default function MoveSuggestion({ fen }: MoveSuggestionProps) {
  const [suggestion, setSuggestion] = useState<SuggestMoveOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestMove({
        boardState: fen,
        difficulty: "medium",
      });
      setSuggestion(result);
    } catch (error) {
      console.error("Error getting move suggestion:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not fetch a move suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-accent" />
          AI Move Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetSuggestion} disabled={isLoading} className="w-full">
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Get a Hint"
          )}
        </Button>
        {suggestion && (
          <div className="space-y-2 rounded-lg border p-4">
            <h3 className="font-semibold">Suggested Move: <span className="font-mono text-primary">{suggestion.move}</span></h3>
            <p className="text-sm text-muted-foreground">{suggestion.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
