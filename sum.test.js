const sum = require('./sum');

test('simple addition', () => {
  expect(sum(1, 2)).toBe(3);
});
