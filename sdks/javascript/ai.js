const MAX_SCORE = 42;

function getMove(player, board) {
  // TODO: Determine valid moves
  // TODO: Calculate best move
  let move;
  do {
    const randomNum = Math.floor(Math.random() * 7);
    move = { column: randomNum };
  } while (!isValidMove(move, board));
  return move;
}

function isValidMove(move, board) {
  // console.log("isValidMove");
  if (move.column < 0 || move.column > 6) return false;
  if (board[0][move.column] !== 0) return false;
  return true;
}

// adapted from https://www.neverstopbuilding.com/blog/minimax
function getScore(board, depth, player) {
  if (getWinner(board) === 0) return 0;
  else if (getWinner(board) === player) return MAX_SCORE - depth;
  else if (getWinner(board) !== player) return depth - MAX_SCORE;
}

// adapted from https://www.neverstopbuilding.com/blog/minimax
function minimax(board, depth, player) {
  if (getWinner(board) != 0) return getScore(board, depth, player);
  depth += 1;
  scores = [];
  moves = [];

  getAvailableMoves(board).forEach((move) => {
    const possibleBoard = getNewBoard(board, move, player);
  });
}

function getNewBoard(board, move, player) {
  let newBoard = JSON.parse(JSON.stringify(board)); // copy the board
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][move.column] === 0) {
      newBoard[i][move.column] = player;
      return newBoard;
    }
  }
  return newBoard;
}

function getAvailableMoves(board) {
  const availableMoves = [];
  for (let i = 0; i < board[0].length; i++) {
    const move = { column: i };
    if (isValidMove(move, board)) availableMoves.push(move);
  }
  return availableMoves;
}

function getWinner(board) {
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      const currentPiece = board[i][j];
      if (currentPiece !== 0) {
        // do horizontal check
        let count = 1;
        for (k = j + 1; k < board[i].length; k++) {
          if (board[i][k] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          }
        }
        // do vertical check
        for (n = j + 1; n < board[i].length; n++) {
          if (board[i][n] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          }
        }
        // do diagonal check
        for (x = j + 1; n < board[i].length; x++) {
          if (board[i][x] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          }
        }
      }
    }
    getWinner(board[i]);
  }
}

function prepareResponse(move) {
  const response = `${JSON.stringify(move)}\n`;
  console.log(`Sending response ${response}`);
  return response;
}

module.exports = { getMove, isValidMove, prepareResponse, getWinner, getNewBoard };
