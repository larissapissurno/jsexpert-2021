class Fibonacci {
  *execute(input, current = 0, next = 1) {
    if (input === 0) {
      return 0;
    }
    // returns the value
    yield current;

    // delegate the function but doesn't returns the value
    yield* this.execute(input - 1, next, current + next);
  }
}

module.exports = Fibonacci;
