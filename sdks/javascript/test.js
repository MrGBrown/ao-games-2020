const ai = require('./ai');

test('returns a valid response', () => {
  expect(ai.prepareResponse({column: 1})).toEqual(`{"column":1}\n`)
});
