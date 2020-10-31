function getMove(player, board) {
  // TODO: Determine valid moves
  // TODO: Calculate best move
  return {column: 1};
}

function prepareResponse(move) {
  const response = `${JSON.stringify(move)}\n`;
  console.log(`Sending response ${response}`);
  return response;
}

module.exports = { getMove, prepareResponse };
