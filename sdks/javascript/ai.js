const NEGATIVE_INF = -999999;
const POSITIVE_INF = 999999;
const NUM_ROWS = 6;
const NUM_COLS = 7;

var me;

function getMove(player, board) {
  me = player; // set this global variable so we know who we are
  var move = maximize(board, 6, NEGATIVE_INF, POSITIVE_INF).move;
  if (move !== undefined) return move;
  else return getRandomMove()
}

function getRandomMove() {
  return {column: Math.floor(Math.random() * 7)}
}

function maximize(board, depth, alpha, beta) {
  var score = getScore(board, depth);

  if (getWinner(board) !== 0 || depth === 0) return { move: undefined, score: score };

  var bestMove = { move: undefined, score: NEGATIVE_INF };

  getAvailableMoves(board).forEach(move => {
    var newBoard = getNewBoard(board, move, me);
    var nextMove = minimize(newBoard, depth - 1, alpha, beta);
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
  var score = getScore(board, depth);

  if (getWinner(board) !== 0 || depth === 0) return { move: undefined, score: score };

  var bestMove = { move: undefined, score: POSITIVE_INF };

  getAvailableMoves(board).forEach(move => {
    var newBoard = getNewBoard(board, move, me === 1 ? 2 : 1);
    var nextMove = maximize(newBoard, depth - 1, alpha, beta);
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
  var verticalPoints = 0;
  var horizontalPoints = 0;
  var diagonal1Points = 0;
  var diagonal2Points = 0;

  var row;
  var col;

  // get the vertical points
  for (row = 0; row < NUM_ROWS; row++) {
    for (col = 0; col < NUM_COLS; col++) {
      verticalPoints += getPositionScore(board, row, col, 1, 0);
    }
  }

  // get the horizontal points
  for (row = 0; row < NUM_ROWS; row++) {
    for (col = 0; col < NUM_COLS; col++) {
      horizontalPoints += getPositionScore(board, row, col, 0, 1);
    }
  }

  // get the diagonal1 points
  for (row = 0; row < NUM_ROWS; row++) {
    for (col = 0; col < NUM_COLS; col++) {
      diagonal1Points += getPositionScore(board, row, col, 1, 1);
    }
  }

  // get the diagonal1 points
  for (row = 0; row < NUM_ROWS; row++) {
    for (col = 0; col < NUM_COLS; col++) {
      diagonal2Points += getPositionScore(board, row, col, 1, -1);
    }
  }

  return verticalPoints + horizontalPoints + diagonal1Points + diagonal2Points + depth * depth;
}

function getPositionScore(board, row, col, changeRow, changeCol) {
  var myScore = 0;
  var theirScore = 0;

  // var currentPiece = board[row][col];
  // if (currentPiece === 0) return 0;

  for (var i = 0; i < 4; i++) {
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

  return myScore - 0.5*theirScore;
}

function getNewBoard(board, move, player) {
  var newBoard = JSON.parse(JSON.stringify(board)); // copy the board
  for (var i = NUM_ROWS - 1; i >= 0; i--) {
    if (board[i][move.column] === 0) {
      newBoard[i][move.column] = player;
      return newBoard;
    }
  }
  return newBoard;
}

function getAvailableMoves(board) {
  var availableMoves = [];
  for (var i = 0; i < board[0].length; i++) {
    var move = { column: i };
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
  for (var row = 0; row < NUM_ROWS; row++) {
    for (var col = 0; col < NUM_COLS; col++) {
      var currentPiece = board[row][col];
      if (currentPiece !== 0) {
        var k;
        var l;
        // do vertical check
        count = 1;
        for (k = row + 1; k < NUM_ROWS; k++) {
          if (board[k][col] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          } else break;
        }
        // do horizontal check
        var count = 1;
        for (k = col + 1; k < NUM_COLS; k++) {
          if (board[row][k] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          } else break;
        }
        // do diagonal1 check
        k = row + 1;
        l = col + 1;
        count = 1;
        while (k < NUM_ROWS && l < NUM_COLS) {
          if (board[k][l] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          } else break;
          k++;
          l++;
        }
        // do diagonal2 check
        k = row + 1;
        l = col + 1;
        count = 1;
        while (k < NUM_ROWS && l < NUM_COLS) {
          if (board[k][l] === currentPiece) {
            count++;
            if (count === 4) return currentPiece;
          } else break;
          k++;
          l--;
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
