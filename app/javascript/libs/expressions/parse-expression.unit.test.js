import { expect } from "chai";
import { COMPARISON_OPERATORS, LOGICAL_OPERATORS } from "./constants";
import parseExpression from "./parse-expression";

describe("parseExpression", () => {
  context("when is a eq expression", () => {
    const expression = parseExpression({ eq: { sex: "male" } });

    it("returns a eq expression", () => {
      expect(expression.operator).to.equal(COMPARISON_OPERATORS.EQ);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male" })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "female" })).to.be.false;
    });
  });

  context("when is a ge expression", () => {
    const expression = parseExpression({ ge: { age: 5 } });

    it("returns a ge expression", () => {
      expect(expression.operator).to.equal(COMPARISON_OPERATORS.GE);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 5 })).to.be.true;
      expect(expression.evaluate({ age: 10 })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.operator).to.equal(COMPARISON_OPERATORS.GE);
      expect(expression.evaluate({ age: 4 })).to.be.false;
    });
  });

  context("when is a gt expression", () => {
    const expression = parseExpression({ gt: { age: 5 } });

    it("returns a gt expression", () => {
      expect(expression.operator).to.equal(COMPARISON_OPERATORS.GT);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 10 })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ age: 4 })).to.be.false;
      expect(expression.evaluate({ age: 5 })).to.be.false;
    });
  });

  context("when is a le expression", () => {
    const expression = parseExpression({ le: { age: 10 } });

    it("returns lt in expression", () => {
      expect(expression.operator).to.equal(COMPARISON_OPERATORS.LE);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 10 })).to.be.true;
      expect(expression.evaluate({ age: 5 })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ age: 12 })).to.be.false;
    });
  });

  context("when is a lt expression", () => {
    const expression = parseExpression({ lt: { age: 10 } });

    it("returns lt in expression", () => {
      expect(expression.operator).to.equal(COMPARISON_OPERATORS.LT);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 8 })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ age: 10 })).to.be.false;
      expect(expression.evaluate({ age: 12 })).to.be.false;
    });
  });

  context("when is a in expression", () => {
    const expression = parseExpression({ in: { sex: ["male", "female"] } });

    it("returns an in expression", () => {
      expect(expression.operator).to.equal(COMPARISON_OPERATORS.IN);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male" })).to.be.true;
      expect(expression.evaluate({ sex: "female" })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "value1" })).to.be.false;
    });
  });

  context("when is an and expression", () => {
    const expression = parseExpression({ and: [{ eq: { sex: "male" } }, { eq: { age: 5 } }] });

    it("returns an and expression", () => {
      expect(expression.operator).to.equal(LOGICAL_OPERATORS.AND);
      expect(expression.expressions.map(nested => nested.operator)).to.deep.equal([
        COMPARISON_OPERATORS.EQ,
        COMPARISON_OPERATORS.EQ
      ]);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male", age: 5 })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "male", age: 10 })).to.be.false;
      expect(expression.evaluate({ sex: "female", age: 5 })).to.be.false;
    });
  });

  context("when is an or expression", () => {
    const expression = parseExpression({ or: [{ eq: { sex: "male" } }, { eq: { age: 5 } }] });

    it("returns an or expression", () => {
      expect(expression.operator).to.equal(LOGICAL_OPERATORS.OR);
      expect(expression.expressions.map(nested => nested.operator)).to.deep.equal([
        COMPARISON_OPERATORS.EQ,
        COMPARISON_OPERATORS.EQ
      ]);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male", age: 10 })).to.be.true;
      expect(expression.evaluate({ sex: "female", age: 5 })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "female", age: 10 })).to.be.false;
    });
  });

  context("when is not expression", () => {
    const expression = parseExpression({ not: { eq: { sex: "male" } } });

    it("returns an not expression", () => {
      expect(expression.operator).to.equal(LOGICAL_OPERATORS.NOT);
      expect(expression.expression.operator).to.equal(COMPARISON_OPERATORS.EQ);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "female" })).to.be.true;
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "male" })).to.be.false;
    });
  });

  context("when is a deprecated syntax", () => {
    const expression = parseExpression([{ sex: "male" }]);

    it("correctly evaluates the expression to be true", () => {
      expect(expression.evaluate({ sex: "male" })).to.be.true;
    });

    it("correctly evaluates the expression to be false", () => {
      expect(expression.evaluate({ sex: "female" })).to.be.false;
    });
  });

  context('when is a sum expression', () => {
    const expression = parseExpression({ sum: ['a', 'b', 'c'] });

    it('correctly evaluates the sum', () => {
      expect(expression.evaluate({ 'a': 2, 'b': 3})).to.deep.equals(5);
    });

    it('returns 0 when wrong arguments are passed', () => {
      expect(expression.evaluate({ 'd': 2, 'e': 3})).to.deep.equals(0);
    });
  });
});
