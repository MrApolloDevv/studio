'use server';

/**
 * @fileOverview An AI agent that explains the reasoning behind a suggested chess move.
 *
 * - explainMove - A function that explains the AI's suggested move.
 * - ExplainMoveInput - The input type for the explainMove function.
 * - ExplainMoveOutput - The return type for the explainMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMoveInputSchema = z.object({
  boardState: z.string().describe('The current state of the chessboard in FEN notation.'),
  suggestedMove: z.string().describe('The suggested move in algebraic notation.'),
});
export type ExplainMoveInput = z.infer<typeof ExplainMoveInputSchema>;

const ExplainMoveOutputSchema = z.object({
  explanation: z.string().describe('The AI explanation of the suggested move.'),
});
export type ExplainMoveOutput = z.infer<typeof ExplainMoveOutputSchema>;

export async function explainMove(input: ExplainMoveInput): Promise<ExplainMoveOutput> {
  return explainMoveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMovePrompt',
  input: {schema: ExplainMoveInputSchema},
  output: {schema: ExplainMoveOutputSchema},
  prompt: `Você é um grande mestre de xadrez. Explique em detalhes o raciocínio por trás da jogada "{{{suggestedMove}}}" dado o estado do tabuleiro "{{{boardState}}}". Foque nas vantagens táticas e estratégicas obtidas, ameaças potenciais evitadas e o impacto geral no jogo. Mantenha a explicação concisa e precisa para jogadores de xadrez novatos.
`,
});

const explainMoveFlow = ai.defineFlow(
  {
    name: 'explainMoveFlow',
    inputSchema: ExplainMoveInputSchema,
    outputSchema: ExplainMoveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
