import orOperator from "./or";
import andOperator from "./and";
import eqOperator from "./eq";
import gtOperator from "./gt";

describe("orOperator", () => {
  context("when comparison operators are used", () => {
    const operator = orOperator([eqOperator({ sex: "male" }), gtOperator({ age: 8 })]);

    it("should return true", () => {
      expect(operator.evaluate({ sex: "male", age: 10 })).to.be.true;
      expect(operator.evaluate({ sex: "female", age: 10 })).to.be.true;
    });

    it("should return false", () => {
      expect(operator.evaluate({ sex: "female", age: 8 })).to.be.false;
      expect(operator.evaluate({ sex: "female", age: 5 })).to.be.false;
    });
  });

  context("when logical operator are used", () => {
    const operator = orOperator([
      andOperator([eqOperator({ sex: "male" }), gtOperator({ age: 8 })]),
      eqOperator({ sex: "female" })
    ]);

    it("should return true", () => {
      expect(operator.evaluate({ sex: "male", age: 10 })).to.be.true;
      expect(operator.evaluate({ sex: "female" })).to.be.true;
      expect(operator.evaluate({ sex: "female", age: 5 })).to.be.true;
    });

    it("should return false", () => {
      expect(operator.evaluate({ sex: "male", age: 8 })).to.be.false;
      expect(operator.evaluate({ age: 9 })).to.be.false;
    });
  });
});
