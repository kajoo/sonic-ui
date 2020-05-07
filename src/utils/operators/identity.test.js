import identity from './identity';

describe('identity operator', () => {
  it('should return given input', () => {
    const aNumber = 4;
    const anObject = { a: 1 };

    expect(identity(aNumber)).toBe(4);
    expect(identity(anObject)).toBe(anObject);
  });
});
