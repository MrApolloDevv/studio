'use server';
/**
 * @fileOverview An AI agent that suggests chess moves.
 *
 * - suggestMove - A function that suggests a chess move based on the current game state.
 * - SuggestMoveInput - The input type for the suggestMove function.
 * - SuggestMoveOutput - The return type for the suggestMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMoveInputSchema = z.object({
  boardState: z
    .string()
    .describe(
      'A string representing the current state of the chessboard in standard chess notation (FEN).'
    ),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the move suggestion.'),
});
export type SuggestMoveInput = z.infer<typeof SuggestMoveInputSchema>;

const SuggestMoveOutputSchema = z.object({
  move: z.string().describe('The suggested move in "from-to" standard algebraic notation (e.g., "e2-e4").'),
  explanation: z
    .string()
    .describe('An explanation of why the move is a good suggestion.'),
});
export type SuggestMoveOutput = z.infer<typeof SuggestMoveOutputSchema>;

export async function suggestMove(input: SuggestMoveInput): Promise<SuggestMoveOutput> {
  return suggestMoveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMovePrompt',
  input: {schema: SuggestMoveInputSchema},
  output: {schema: SuggestMoveOutputSchema},
  prompt: `Você é um grande mestre de xadrez. Você irá sugerir a melhor jogada para o jogador atual, dado o estado do tabuleiro.

Estado do Tabuleiro (FEN): {{{boardState}}}
Dificuldade: {{{difficulty}}}

Responda com a jogada sugerida em notação algébrica "origem-destino" (por exemplo, "e2-e4") e explique por que é uma boa jogada.

Siga este formato:
Jogada: <origem>-<destino>
Explicação: <explicação>`,
});

const suggestMoveFlow = ai.defineFlow(
  {
    name: 'suggestMoveFlow',
    inputSchema: SuggestMoveInputSchema,
    outputSchema: SuggestMoveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
