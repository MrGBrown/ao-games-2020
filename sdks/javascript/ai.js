const MAX_SCORE = 42;
const NEGATIVE_INF = -999999;
const POSITIVE_INF = 999999;
const NUM_ROWS = 6;
const NUM_COLS = 7;

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

  return maximize(board, 6).move;

  // return getNextMove();
}

let current = 0;
function getNextMove() {
  current = (current + 1) % 7;
  return { column: current };
}

// adapted from https://www.neverstopbuilding.com/blog/minimax
// function minimax(board, depth, player) {
//   if (getWinner(board) !== 0 || depth >= 4) return {score: getScore(board, depth, player)};
//   depth++;
//   let scores = [];
//   let moves = [];

//   getAvailableMoves(board).forEach((move) => {
//     const possibleBoard = getNewBoard(board, move, player);
//     scores.push(minimax(possibleBoard, depth, player === 1 ? 2 : 1).score);
//     moves.push(move);
//   });

//   if (player === me) {
//     // do the max calculation
//     const max_score_index = scores.indexOf(Math.max(...scores));
//     return { score: scores[max_score_index], move: moves[max_score_index] };
//   } else {
//     // do the min calculation
//     const min_score_index = scores.indexOf(Math.min(...scores));
//     return { score: scores[min_score_index], move: moves[min_score_index] };
//   }
// }

function maximize(board, depth, alpha, beta) {
  let score = getScore(board, depth);

  if (getWinner(board) !== 0 || depth === 0) return { move: undefined, score: score };

  let bestMove = { move: undefined, score: NEGATIVE_INF };

  getAvailableMoves(board).forEach((move) => {
    let newBoard = getNewBoard(board, move, me);
    let nextMove = minimize(newBoard, depth - 1, alpha, beta);
    if (!bestMove.move || nextMove.score > bestMove.score) {
      bestMove.move = move;
      bestMove.score = nextMove.score;
      alpha = nextMove.score;
    }
    if (alpha >= beta) return;
  });

  return bestMove;
}

function minimize(board, depth, alpha, beta) {
  let score = getScore(board, depth);

  if (getWinner(board) !== 0 || depth === 0) return { move: undefined, score: score };

  let bestMove = { move: undefined, score: POSITIVE_INF };

  getAvailableMoves(board).forEach((move) => {
    let newBoard = getNewBoard(board, move, me === 1 ? 2 : 1);
    let nextMove = maximize(newBoard, depth - 1, alpha, beta);
    if (!bestMove.move || nextMove.score < bestMove.score) {
      bestMove.move = move;
      bestMove.score = nextMove.score;
      beta = nextMove.score;
    }
    if (alpha >= beta) return;
  });

  return bestMove;
}

function getScore(board, depth) {
  let verticalPoints = 0;
  let horizontalPoints = 0;
  let diagonal1Points = 0;
  let diagonal2Points = 0;

  // get the vertical points
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLS; col++) {
      verticalPoints += getPositionScore(board, row, col, 1, 0);
    }
  }

  // get the horizontal points
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLS; col++) {
      horizontalPoints += getPositionScore(board, row, col, 0, 1);
    }
  }

  // get the diagonal1 points
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLS; col++) {
      diagonal1Points += getPositionScore(board, row, col, 1, 1);
    }
  }

  // get the diagonal1 points
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLS; col++) {
      diagonal2Points += getPositionScore(board, row, col, 1, -1);
    }
  }

  // if (getWinner(board) === 0) return 0;
  // else if (getWinner(board) === me) return MAX_SCORE - depth;
  // else if (getWinner(board) !== me) return depth - MAX_SCORE;

  return verticalPoints + horizontalPoints + diagonal1Points + diagonal2Points;
}

function getPositionScore(board, row, col, changeRow, changeCol) {
  let myScore = 0;
  let theirScore = 0;

  // let currentPiece = board[row][col];
  // if (currentPiece === 0) return 0;

  for (let i = 0; i < 4; i++) {
    if (board[row] === undefined || board[row][col] === undefined) break;
    if (board[row][col] === me) myScore++;
    else if (board[row][col] !== me && board[row][col] !== 0) theirScore++;

    row += changeRow;
    col += changeCol;
  }

  if (myScore === 4) return 10000;
  if (theirScore === 4) return -10000;

  // if (theirScore === 3) {
  //   myScore -= 1000;
  // }

  return myScore;
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

module.exports = {
  getMove,
  isValidMove,
  prepareResponse,
  getWinner,
  getNewBoard,
  getPositionScore,
  getScore,
};
