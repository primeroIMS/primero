// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { COMPARISON_OPERATORS, LOGICAL_OPERATORS } from "./constants";
import parseExpression from "./parse-expression";

describe("parseExpression", () => {
  describe("when is a eq expression", () => {
    const expression = parseExpression({ eq: { sex: "male" } });

    it("returns a eq expression", () => {
      expect(expression.operator).toBe(COMPARISON_OPERATORS.EQ);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male" })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "female" })).toBe(false);
    });
  });

  describe("when is a ge expression", () => {
    const expression = parseExpression({ ge: { age: 5 } });

    it("returns a ge expression", () => {
      expect(expression.operator).toBe(COMPARISON_OPERATORS.GE);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 5 })).toBe(true);
      expect(expression.evaluate({ age: 10 })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.operator).toBe(COMPARISON_OPERATORS.GE);
      expect(expression.evaluate({ age: 4 })).toBe(false);
    });
  });

  describe("when is a gt expression", () => {
    const expression = parseExpression({ gt: { age: 5 } });

    it("returns a gt expression", () => {
      expect(expression.operator).toBe(COMPARISON_OPERATORS.GT);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 10 })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ age: 4 })).toBe(false);
      expect(expression.evaluate({ age: 5 })).toBe(false);
    });
  });

  describe("when is a le expression", () => {
    const expression = parseExpression({ le: { age: 10 } });

    it("returns lt in expression", () => {
      expect(expression.operator).toBe(COMPARISON_OPERATORS.LE);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 10 })).toBe(true);
      expect(expression.evaluate({ age: 5 })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ age: 12 })).toBe(false);
    });
  });

  describe("when is a lt expression", () => {
    const expression = parseExpression({ lt: { age: 10 } });

    it("returns lt in expression", () => {
      expect(expression.operator).toBe(COMPARISON_OPERATORS.LT);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ age: 8 })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ age: 10 })).toBe(false);
      expect(expression.evaluate({ age: 12 })).toBe(false);
    });
  });

  describe("when is a in expression", () => {
    const expression = parseExpression({ in: { sex: ["male", "female"] } });

    it("returns an in expression", () => {
      expect(expression.operator).toBe(COMPARISON_OPERATORS.IN);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male" })).toBe(true);
      expect(expression.evaluate({ sex: "female" })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "value1" })).toBe(false);
    });
  });

  describe("when is an and expression", () => {
    const expression = parseExpression({ and: [{ eq: { sex: "male" } }, { eq: { age: 5 } }] });

    it("returns an and expression", () => {
      expect(expression.operator).toBe(LOGICAL_OPERATORS.AND);
      expect(expression.expressions.map(nested => nested.operator)).toEqual([
        COMPARISON_OPERATORS.EQ,
        COMPARISON_OPERATORS.EQ
      ]);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male", age: 5 })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "male", age: 10 })).toBe(false);
      expect(expression.evaluate({ sex: "female", age: 5 })).toBe(false);
    });
  });

  describe("when is an or expression", () => {
    const expression = parseExpression({ or: [{ eq: { sex: "male" } }, { eq: { age: 5 } }] });

    it("returns an or expression", () => {
      expect(expression.operator).toBe(LOGICAL_OPERATORS.OR);
      expect(expression.expressions.map(nested => nested.operator)).toEqual([
        COMPARISON_OPERATORS.EQ,
        COMPARISON_OPERATORS.EQ
      ]);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "male", age: 10 })).toBe(true);
      expect(expression.evaluate({ sex: "female", age: 5 })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "female", age: 10 })).toBe(false);
    });
  });

  describe("when is not expression", () => {
    const expression = parseExpression({ not: { eq: { sex: "male" } } });

    it("returns an not expression", () => {
      expect(expression.operator).toBe(LOGICAL_OPERATORS.NOT);
      expect(expression.expression.operator).toBe(COMPARISON_OPERATORS.EQ);
    });

    it("evaluates to true", () => {
      expect(expression.evaluate({ sex: "female" })).toBe(true);
    });

    it("evaluates to false", () => {
      expect(expression.evaluate({ sex: "male" })).toBe(false);
    });
  });

  describe("when is a deprecated syntax", () => {
    const expression = parseExpression([{ sex: "male" }]);

    it("correctly evaluates the expression to be true", () => {
      expect(expression.evaluate({ sex: "male" })).toBe(true);
    });

    it("correctly evaluates the expression to be false", () => {
      expect(expression.evaluate({ sex: "female" })).toBe(false);
    });
  });

  describe("when is a sum expression", () => {
    const expression = parseExpression({ sum: ["a", "b", "c"] });

    it("correctly evaluates the sum", () => {
      expect(expression.evaluate({ a: 2, b: 3 })).toEqual(5);
    });

    it("returns 0 when wrong arguments are passed", () => {
      expect(expression.evaluate({ d: 2, e: 3 })).toEqual(0);
    });
  });

  describe("when sum is nested", () => {
    const expression = parseExpression({ sum: [{ sum: ["a", "b", "c"] }, "d"] });

    it("expression is nested", () => {
      expect(expression.evaluate({ a: 1, b: 2, c: 3, d: 4 })).toEqual(10);
    });
  });

  describe("avgOperator", () => {
    const operator = parseExpression({ avg: ["a", "b", "c"] });
    const decimalOperator = parseExpression({ avg: { data: ["a", "b", "c"], extra: { decimalPlaces: 3 } } });

    it("should return avg", () => {
      expect(operator.evaluate({ a: 3, b: 4, c: 2 })).toEqual(3);
    });

    it("should return avg when single argument passed", () => {
      expect(operator.evaluate({ a: 3 })).toEqual(3);
    });

    it("should return 0 when wrong arguments passed", () => {
      expect(operator.evaluate({ d: 3, e: 4 })).toEqual(0);
    });

    it("returns 0 when no argument passed", () => {
      expect(operator.evaluate({})).toEqual(0);
    });
    it("works with decimalPlaces specified", () => {
      expect(decimalOperator.evaluate({ a: 3, b: 2 })).toEqual(2.5);
    });
    it("Correctly rounds to the right number of decimal places", () => {
      expect(decimalOperator.evaluate({ a: 2, b: 2, c: 1 })).toEqual(1.667);
    });
    it("works with strings", () => {
      expect(decimalOperator.evaluate({ a: "2", b: "3" })).toEqual(2.5);
    });
  });
});
