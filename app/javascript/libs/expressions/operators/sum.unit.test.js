import { expect } from "chai";
import sumOperator from "./sum";

describe('sumOperator', () => {
  const operator = sumOperator(['a', 'b', 'c']);

  it('should return sum', () => {
    expect(operator.evaluate({ a: 3, b: 4, c: 2 })).to.deep.equals(9)
  });

  it('should return 0 when wrong arguments passed', () => {
    expect(operator.evaluate({ d: 3, e: 4 })).to.deep.equals(0)
  })

  it('returns 0 when no argument passed', () => {
    expect(operator.evaluate({})).to.deep.equals(0)
  });
});
