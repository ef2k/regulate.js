// tests.js

describe('rules',  function () {
  it('should check for the given minimum length', function () {
    expect(Regulate.Rules.min_length(foobar, {min_length:5})).toBe(true);
  });
});