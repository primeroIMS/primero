import { fromJS } from "immutable";

import notOperator from "./not";
import eqOperator from "./eq";
import orOperator from "./or";

describe("notOperator", () => {
  context("when a comparison operator is used", () => {
    const operator = notOperator(eqOperator({ sex: "male" }));

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 5 }))).to.be.true;
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 5 }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ sex: "female", age: 5 })).to.be.true;
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate({ sex: "male", age: 5 })).to.be.false;
      });
    });
  });

  context("when a logical operator is used", () => {
    const operator = notOperator(orOperator([eqOperator({ sex: "male" }), eqOperator({ age: 5 })]));

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 10 }))).to.be.true;
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 5 }))).to.be.false;
        expect(operator.evaluate(fromJS({ sex: "male", age: 10 }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ sex: "female", age: 10 })).to.be.true;
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate({ sex: "female", age: 5 })).to.be.false;
        expect(operator.evaluate({ sex: "male", age: 10 })).to.be.false;
      });
    });
  });

  it("throws an error if an array of operators is passed", () => {
    const operator = notOperator([eqOperator({ sex: "male" }), eqOperator({ age: 5 })]);

    context("when the data is immutable", () => {
      expect(() => operator.evaluate(fromJS({ sex: "male" }))).to.throw(/Invalid expression/);
    });

    context("when the data is not immutable", () => {
      expect(() => operator.evaluate({ sex: "male" })).to.throw(/Invalid expression/);
    });
  });
});
