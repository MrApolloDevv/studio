export type PieceSymbol = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';
export type PlayerColor = 'w' | 'b';

export interface Piece {
  color: PlayerColor;
  type: PieceSymbol;
}

export type Square = Piece | null;
export type Board = Square[][];

export const initialBoard: Board = [
  [{type: 'R', color: 'b'}, {type: 'N', color: 'b'}, {type: 'B', color: 'b'}, {type: 'Q', color: 'b'}, {type: 'K', color: 'b'}, {type: 'B', color: 'b'}, {type: 'N', color: 'b'}, {type: 'R', color: 'b'}],
  Array(8).fill({type: 'P', color: 'b'}),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({type: 'P', color: 'w'}),
  [{type: 'R', color: 'w'}, {type: 'N', color: 'w'}, {type: 'B', color: 'w'}, {type: 'Q', color: 'w'}, {type: 'K', color: 'w'}, {type: 'B', color: 'w'}, {type: 'N', color: 'w'}, {type: 'R', color: 'w'}],
];

export function boardToFEN(board: Board, activeColor: PlayerColor, fullMoveNumber: number): string {
    let fen = '';
    // 1. Piece placement
    for (let i = 0; i < 8; i++) {
        let emptyCount = 0;
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                fen += piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
            } else {
                emptyCount++;
            }
        }
        if (emptyCount > 0) {
            fen += emptyCount;
        }
        if (i < 7) {
            fen += '/';
        }
    }

    // 2. Active color
    fen += ` ${activeColor}`;

    // 3. Castling availability (simplified)
    fen += ' -'; // simplified, no castling tracking

    // 4. En passant target square (simplified)
    fen += ' -'; // simplified, no en passant tracking

    // 5. Halfmove clock (simplified)
    fen += ' 0'; // simplified

    // 6. Fullmove number
    fen += ` ${fullMoveNumber}`;
    
    return fen;
}

export function coordsToAlgebraic(row: number, col: number): string {
    const files = 'abcdefgh';
    const ranks = '87654321';
    return `${files[col]}${ranks[row]}`;
}

export function algebraicToCoords(algebraic: string): { row: number; col: number } {
    const files = 'abcdefgh';
    const ranks = '87654321';
    const file = algebraic[0];
    const rank = algebraic[1];
    return {
        row: ranks.indexOf(rank),
        col: files.indexOf(file),
    };
}
