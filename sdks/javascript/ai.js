const MAX_SCORE = 42;
let me;

function getMove(player, board) {
  me = player; // set this global variable so we know who we are

  // TODO: Determine valid moves
  // TODO: Calculate best move

  // let move;
  // do {
  //   const randomNum = Math.floor(Math.random() * 7);
  //   move = { column: randomNum };
  // } while (!isValidMove(move, board));
  // return move;

  return minimax(board, 0, me).move;
}

// adapted from https://www.neverstopbuilding.com/blog/minimax
function minimax(board, depth, player) {
  if (getWinner(board) !== 0 || depth >= 4) return {score: getScore(board, depth, player)};
  depth++;
  let scores = [];
  let moves = [];

  getAvailableMoves(board).forEach((move) => {
    const possibleBoard = getNewBoard(board, move, player);
    scores.push(minimax(possibleBoard, depth, player === 1 ? 2 : 1).score);
    moves.push(move);
  });

  if (player === me) {
    // do the max calculation
    const max_score_index = scores.indexOf(Math.max(...scores));
    return { score: scores[max_score_index], move: moves[max_score_index] };
  } else {
    // do the min calculation
    const min_score_index = scores.indexOf(Math.min(...scores));
    return { score: scores[min_score_index], move: moves[min_score_index] };
  }
}

// adapted from https://www.neverstopbuilding.com/blog/minimax
function getScore(board, depth) {
  if (getWinner(board) === 0) return 0;
  else if (getWinner(board) === me) return MAX_SCORE - depth;
  else if (getWinner(board) !== me) return depth - MAX_SCORE;
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

function isValidMove(move, board) {
  // console.log("isValidMove");
  if (move.column < 0 || move.column > 6) return false;
  if (board[0][move.column] !== 0) return false;
  return true;
}

function getWinner(board) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const currentPiece = board[row][col];
      if (currentPiece !== 0) {
        // do horizontal check
        let count = 1;
        for (let k = col + 1; k < board[row].length; k++) {
          if (board[row][k] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          } else break;
        }
        // do vertical check
        count = 1;
        for (let k = row + 1; k < board.length; k++) {
          if (board[k][col] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          } else break;
        }
        // do diagonal check
        let k = row + 1;
        let l = col + 1;
        count = 1;
        while (k < board.length && l < board[k].length) {
          if (board[k][l] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          } else break;
          k++;
          l++;
        }
      }
    }
  }
  return 0;
}

function prepareResponse(move) {
  const response = `${JSON.stringify(move)}\n`;
  console.log(`Sending response ${response}`);
  return response;
}

module.exports = { getMove, isValidMove, prepareResponse, getWinner, getNewBoard };
