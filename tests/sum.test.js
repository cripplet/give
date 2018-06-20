const sum = require('../src/sum');

test('simple addition', () => {
  expect(sum.sum(1, 2)).toBe(3);
});
