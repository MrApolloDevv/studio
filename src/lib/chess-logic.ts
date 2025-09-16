export type PieceSymbol = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';
export type PlayerColor = 'w' | 'b';

export interface Piece {
  color: PlayerColor;
  type: PieceSymbol;
  hasMoved: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

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
        // We need a simplified isMoveValid that only checks for attack, ignoring turns and king checks
        const canAttack = isPseudoMoveValid(board, { row: r, col: c }, { row, col });
        if (canAttack) {
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

function isPseudoMoveValid(board: Board, from: { row: number; col: number }, to: { row: number; col: number }): boolean {
  const piece = board[from.row][from.col];
  const targetPiece = board[to.row][to.col];

  if (!piece) return false;
  if (targetPiece && targetPiece.color === piece.color) return false; // Can't capture same color

  const dRow = to.row - from.row;
  const dCol = to.col - from.col;
  const turn = piece.color;

  switch (piece.type) {
    case 'P':
      const forward = turn === 'w' ? -1 : 1;
      return Math.abs(dCol) === 1 && dRow === forward; // Only checks capture for attack
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
      return Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1;
  }
  return false;
}

export function isMoveValid(board: Board, from: { row: number; col: number }, to: { row: number; col: number }): boolean {
  const piece = board[from.row][from.col];
  const targetPiece = board[to.row][to.col];

  if (!piece) return false;
  if (targetPiece && targetPiece.color === piece.color) return false;

  const turn = piece.color;
  const dRow = to.row - from.row;
  const dCol = to.col - from.col;

  // Castling logic
  if (piece.type === 'K' && Math.abs(dCol) === 2 && dRow === 0) {
    if (piece.hasMoved) return false;

    const kingPos = findKing(board, piece.color);
    if (!kingPos || isSquareUnderAttack(board, kingPos.row, kingPos.col, turn === 'w' ? 'b' : 'w')) return false;

    const isShortCastle = dCol === 2;
    const rookCol = isShortCastle ? 7 : 0;
    const rook = board[from.row][rookCol];

    if (!rook || rook.type !== 'R' || rook.hasMoved) return false;

    const pathStart = isShortCastle ? from.col + 1 : to.col + 1;
    const pathEnd = isShortCastle ? to.col : from.col;
    for (let c = pathStart; c < pathEnd; c++) {
      if (board[from.row][c]) return false; // Path is not clear
    }

    // Check if squares king passes through are under attack
    const opponentColor = turn === 'w' ? 'b' : 'w';
    for (let c = from.col; c !== to.col + (isShortCastle ? 1 : -1); c += (isShortCastle ? 1 : -1)) {
        if (isSquareUnderAttack(board, from.row, c, opponentColor)) return false;
    }

    return true;
  }

  switch (piece.type) {
    case 'P': // Pawn
      const forward = turn === 'w' ? -1 : 1;
      const startRow = turn === 'w' ? 6 : 1;
      // Move forward
      if (dCol === 0 && !targetPiece) {
        if (dRow === forward) return true;
        if (dRow === 2 * forward && from.row === startRow && !board[from.row + forward][from.col]) return true;
      }
      // Capture
      if (Math.abs(dCol) === 1 && dRow === forward && targetPiece) return true;
      return false;
    case 'N': // Knight
      return (Math.abs(dRow) === 2 && Math.abs(dCol) === 1) || (Math.abs(dRow) === 1 && Math.abs(dCol) === 2);
    case 'B': // Bishop
      if (Math.abs(dRow) !== Math.abs(dCol)) return false;
      return isPathClear(board, from, to);
    case 'R': // Rook
      if (dRow !== 0 && dCol !== 0) return false;
      return isPathClear(board, from, to);
    case 'Q': // Queen
      if ((dRow !== 0 && dCol !== 0) && (Math.abs(dRow) !== Math.abs(dCol))) return false;
      return isPathClear(board, from, to);
    case 'K': // King
      return Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1;
    default:
      return false;
  }
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
