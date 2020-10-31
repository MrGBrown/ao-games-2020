function getMove(player, board) {
  // TODO: Determine valid moves
  // TODO: Calculate best move
  return { column: 1 };
}

function isValidMove(move, board) {
  // console.log("isValidMove");
  if (move.column < 0 || move.column > 6) return false;
  if (board[0][move.column] !== 0) return false;
  return true;
}

function prepareResponse(move) {
  const response = `${JSON.stringify(move)}\n`;
  console.log(`Sending response ${response}`);
  return response;
}

module.exports = { getMove, isValidMove, prepareResponse };
