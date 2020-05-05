const exercise = require('../exercise');

describe('fizzbuzz', () => {
  it('Should throw an error if the input is not a number', () => {
    const args = ['abcd', null, undefined, {}]
    args.forEach(a => {
      expect(() => { exercise.fizzBuzz(a); }).toThrowError();
    })    
  });

  it('Should return FizzBuzz if input is divisible by 3 and 5', () => {
    const result = exercise.fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it('Should return FizzBuzz if input is divisible by 3 only', () => {
    const result = exercise.fizzBuzz(9);
    expect(result).toBe("Fizz");
  });

  it('Should return FizzBuzz if input is divisible by 5 only', () => {
    const result = exercise.fizzBuzz(10);
    expect(result).toBe("Buzz");
  });

  it('Should return the input if it is a number and not divisible by either 3 or 5', () => {
    const input = 8;
    const result = exercise.fizzBuzz(input);
    expect(result).toBe(input);
  });
});