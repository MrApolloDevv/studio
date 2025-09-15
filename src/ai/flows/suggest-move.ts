'use server';
/**
 * @fileoverview A flow that suggests a chess move.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestMoveInputSchema = z.object({
  boardState: z.string().describe('The state of the board in FEN format.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type SuggestMoveInput = z.infer<typeof SuggestMoveInputSchema>;

const SuggestMoveOutputSchema = z.object({
  move: z.string().describe('The suggested move in algebraic notation (e.g., e2-e4).'),
});

export type SuggestMoveOutput = z.infer<typeof SuggestMoveOutputSchema>;

export async function suggestMove(input: SuggestMoveInput): Promise<SuggestMoveOutput> {
  return suggestMoveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMovePrompt',
  input: {schema: SuggestMoveInputSchema},
  output: {schema: SuggestMoveOutputSchema},
  prompt: `You are a chess engine. Your goal is to win the game.

  The user will provide you with the current state of the board in FEN format.

  You must reply with the best possible move in algebraic notation.
  For example: "e2-e4".

  Current board state:
  {{boardState}}`,
});

const suggestMoveFlow = ai.defineFlow(
  {
    name: 'suggestMoveFlow',
    inputSchema: SuggestMoveInputSchema,
    outputSchema: SuggestMoveOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
