export type PieceSymbol = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';
export type PlayerColor = 'w' | 'b';

export interface Piece {
  color: PlayerColor;
  type: PieceSymbol;
  hasMoved: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

type MoveValidationResult = {
  valid: boolean;
  isCheck: boolean;
};


const createPiece = (type: PieceSymbol, color: PlayerColor): Piece => ({ type, color, hasMoved: false });

export const initialBoard: Board = [
  [createPiece('R', 'b'), createPiece('N', 'b'), createPiece('B', 'b'), createPiece('Q', 'b'), createPiece('K', 'b'), createPiece('B', 'b'), createPiece('N', 'b'), createPiece('R', 'b')],
  Array(8).fill(null).map(() => createPiece('P', 'b')),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => createPiece('P', 'w')),
  [createPiece('R', 'w'), createPiece('N', 'w'), createPiece('B', 'w'), createPiece('Q', 'w'), createPiece('K', 'w'), createPiece('B', 'w'), createPiece('N', 'w'), createPiece('R', 'w')],
];

function isSquareUnderAttack(board: Board, row: number, col: number, attackerColor: PlayerColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === attackerColor) {
        if (isPseudoMoveValid(board, { row: r, col: c }, { row, col })) {
          return true;
        }
      }
    }
  }
  return false;
}

function findKing(board: Board, color: PlayerColor): { row: number, col: number } | null {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.type === 'K' && piece.color === color) {
                return { row: r, col: c };
            }
        }
    }
    return null;
}

// A simplified validation that only checks piece movement rules, ignoring checks.
function isPseudoMoveValid(board: Board, from: { row: number; col: number }, to: { row: number; col: number }): boolean {
  const piece = board[from.row][from.col];
  const targetPiece = board[to.row][to.col];

  if (!piece) return false;
  if (targetPiece && targetPiece.color === piece.color) return false;

  const dRow = to.row - from.row;
  const dCol = to.col - from.col;

  switch (piece.type) {
    case 'P':
      const forward = piece.color === 'w' ? -1 : 1;
      const startRow = piece.color === 'w' ? 6 : 1;
      // Move forward
      if (dCol === 0 && !targetPiece) {
        if (dRow === forward) return true;
        if (dRow === 2 * forward && from.row === startRow && !board[from.row + forward][from.col]) return true;
      }
      // Capture
      if (Math.abs(dCol) === 1 && dRow === forward && targetPiece) return true;
      return false;
    case 'N':
      return (Math.abs(dRow) === 2 && Math.abs(dCol) === 1) || (Math.abs(dRow) === 1 && Math.abs(dCol) === 2);
    case 'B':
      if (Math.abs(dRow) !== Math.abs(dCol)) return false;
      return isPathClear(board, from, to);
    case 'R':
      if (dRow !== 0 && dCol !== 0) return false;
      return isPathClear(board, from, to);
    case 'Q':
      if ((dRow !== 0 && dCol !== 0) && (Math.abs(dRow) !== Math.abs(dCol))) return false;
      return isPathClear(board, from, to);
    case 'K':
       // Standard king move
      if (Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1) return true;
       // Castling
      if (dRow === 0 && Math.abs(dCol) === 2 && !piece.hasMoved) {
          const isShortCastle = dCol === 2;
          const rookCol = isShortCastle ? 7 : 0;
          const rook = board[from.row][rookCol];

          if (!rook || rook.type !== 'R' || rook.hasMoved) return false;
          
          const pathStart = isShortCastle ? from.col + 1 : to.col + 1;
          const pathEnd = isShortCastle ? to.col : from.col;
          for (let c = pathStart; c < pathEnd; c++) {
              if (board[from.row][c]) return false; // Path is not clear
          }
          return true;
      }
      return false;
  }
  return false;
}

export function isMoveValid(board: Board, from: { row: number; col: number }, to: { row: number; col: number }): MoveValidationResult {
  const piece = board[from.row][from.col];
  if (!piece) return { valid: false, isCheck: false };

  if (!isPseudoMoveValid(board, from, to)) {
    return { valid: false, isCheck: false };
  }
  
  if (piece.type === 'K' && Math.abs(to.col - from.col) === 2) {
      const kingColor = piece.color;
      const opponentColor = kingColor === 'w' ? 'b' : 'w';

      if (isSquareUnderAttack(board, from.row, from.col, opponentColor)) {
          return { valid: false, isCheck: false };
      }

      const passCol = from.col + (to.col > from.col ? 1 : -1);
      if (isSquareUnderAttack(board, from.row, passCol, opponentColor) || isSquareUnderAttack(board, from.row, to.col, opponentColor)) {
          return { valid: false, isCheck: false };
      }
  }

  const newBoard = board.map(row => row.map(p => p ? {...p} : null));
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;

  const kingPos = findKing(newBoard, piece.color);
  if (!kingPos) {
    return { valid: true, isCheck: false }; // Should not happen in a real game
  }

  const opponentColor = piece.color === 'w' ? 'b' : 'w';
  if (isSquareUnderAttack(newBoard, kingPos.row, kingPos.col, opponentColor)) {
    return { valid: false, isCheck: false }; // Move leaves king in check
  }

  // Check if this move puts the opponent's king in check
  const opponentKingPos = findKing(newBoard, opponentColor);
  let isCheck = false;
  if (opponentKingPos) {
      isCheck = isSquareUnderAttack(newBoard, opponentKingPos.row, opponentKingPos.col, piece.color);
  }

  return { valid: true, isCheck };
}


function isPathClear(board: Board, from: { row: number; col: number }, to: { row: number; col: number }): boolean {
    const dRow = Math.sign(to.row - from.row);
    const dCol = Math.sign(to.col - from.col);
    let { row: r, col: c } = from;

    r += dRow;
    c += dCol;

    while (r !== to.row || c !== to.col) {
        if (board[r][c]) return false;
        r += dRow;
        c += dCol;
    }
    return true;
}


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

export function algebraicToCoords(algebraic: string): { row: number; col: number } | null {
    if (!algebraic || algebraic.length < 2) return null;
    const files = 'abcdefgh';
    const ranks = '87654321';
    const file = algebraic[0];
    const rank = algebraic[1];
    const col = files.indexOf(file);
    const row = ranks.indexOf(rank);

    if (row === -1 || col === -1) return null;

    return { row, col };
}

export function getValidMoves(board: Board, from: { row: number; col: number }): { row: number, col: number }[] {
  const validMoves: { row: number, col: number }[] = [];
  const piece = board[from.row][from.col];
  if (!piece) {
    return [];
  }

  for (let toRow = 0; toRow < 8; toRow++) {
    for (let toCol = 0; toCol < 8; toCol++) {
      if (isMoveValid(board, from, { row: toRow, col: toCol }).valid) {
        validMoves.push({ row: toRow, col: toCol });
      }
    }
  }
  return validMoves;
}

function hasAnyValidMoves(board: Board, color: PlayerColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row: r, col: c });
        if (moves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isCheckmate(board: Board, color: PlayerColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false; 

  const opponentColor = color === 'w' ? 'b' : 'w';
  if (!isSquareUnderAttack(board, kingPos.row, kingPos.col, opponentColor)) {
    return false; // Not in check, so not checkmate
  }

  return !hasAnyValidMoves(board, color);
}

export function isStalemate(board: Board, color: PlayerColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const opponentColor = color === 'w' ? 'b' : 'w';
  if (isSquareUnderAttack(board, kingPos.row, kingPos.col, opponentColor)) {
    return false; // In check, so not stalemate
  }

  return !hasAnyValidMoves(board, color);
}
