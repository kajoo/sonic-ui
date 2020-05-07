import times from './times';

describe('times operator', () => {
  it('should return an empty array for non-number invoke amount', () => {
    expect(times({})).toEqual([]);
    expect(times(true)).toEqual([]);
    expect(times('')).toEqual([]);
    expect(times(null)).toEqual([]);
    expect(times(undefined)).toEqual([]);
    expect(times(Symbol.for('foo'))).toEqual([]);
  });

  it('should return an empty array for non-function iteratee', () => {
    expect(times(5, 'not-a-function')).toEqual([]);
  });

  it('should return a range from 0 to X', () => {
    expect(times(3)).toEqual([0, 1, 2]);
  });

  it('should return iteratee results array', () => {
    const multiple = value => value + value;
    expect(times(3, multiple)).toEqual([0, 2, 4]);
  });
});
