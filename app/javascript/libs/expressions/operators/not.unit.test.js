import notOperator from "./not";
import eqOperator from "./eq";
import orOperator from "./or";

describe("notOperator", () => {
  context("when a comparison operator is used", () => {
    const operator = notOperator(eqOperator({ sex: "male" }));

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ sex: "female", age: 5 })).to.be.true;
    });

    it("returns false if data meets the expression", () => {
      expect(operator.evaluate({ sex: "male", age: 5 })).to.be.false;
    });
  });

  context("when a logical operator is used", () => {
    const operator = notOperator(orOperator([eqOperator({ sex: "male" }), eqOperator({ age: 5 })]));

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ sex: "female", age: 10 })).to.be.true;
    });

    it("returns false if data meets the expression", () => {
      expect(operator.evaluate({ sex: "female", age: 5 })).to.be.false;
      expect(operator.evaluate({ sex: "male", age: 10 })).to.be.false;
    });
  });

  it("throws an error if an array of operators is passed", () => {
    const operator = notOperator([eqOperator({ sex: "male" }), eqOperator({ age: 5 })]);

    expect(operator.evaluate).to.throw(/Invalid expression/);
  });
});
