const sum = require('../src/notmath');

test('simple addition', () => {
  expect(sum.sum(1, 2)).toBe(3);
});
