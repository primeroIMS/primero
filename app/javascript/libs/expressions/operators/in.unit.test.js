import { fromJS } from "immutable";

import inOperator from "./in";

describe("inOperator", () => {
  context("when the property is a single value", () => {
    const operator = inOperator({ sex: ["female"] });

    context("when the data is immutable", () => {
      it("returns true if the value is contained in the property", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 5 }))).to.be.true;
      });

      it("returns false if the value is not contained in the array", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 5 }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if the value is contained in the property", () => {
        expect(operator.evaluate({ sex: "female", age: 5 })).to.be.true;
      });

      it("returns false if the value is not contained in the array", () => {
        expect(operator.evaluate({ sex: "male", age: 5 })).to.be.false;
      });
    });
  });

  context("when the property is an array value", () => {
    const operator = inOperator({ religion: ["religion1", "religion2"] });

    context("when the data is immutable", () => {
      it("returns true if all the values in the array are contained in the property", () => {
        expect(operator.evaluate(fromJS({ religion: ["religion1", "religion2"] }))).to.be.true;
        expect(operator.evaluate(fromJS({ religion: ["religion1", "religion2", "religion3"] }))).to.be.true;
      });

      it("returns false for any value that is not in the property", () => {
        expect(operator.evaluate(fromJS({ religion: ["religion1", "religion3"] }))).to.be.false;
        expect(operator.evaluate(fromJS({ religion: ["religion2", "religion3"] }))).to.be.false;
        expect(operator.evaluate(fromJS({ religion: ["religion1"] }))).to.be.false;
        expect(operator.evaluate(fromJS({ religion: ["religion2"] }))).to.be.false;
        expect(operator.evaluate(fromJS({ religion: ["religion3"] }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if all the values in the array are contained in the property", () => {
        expect(operator.evaluate({ religion: ["religion1", "religion2"] })).to.be.true;
        expect(operator.evaluate({ religion: ["religion1", "religion2", "religion3"] })).to.be.true;
      });

      it("returns false for any value that is not in the property", () => {
        expect(operator.evaluate({ religion: ["religion1", "religion3"] })).to.be.false;
        expect(operator.evaluate({ religion: ["religion2", "religion3"] })).to.be.false;
        expect(operator.evaluate({ religion: ["religion1"] })).to.be.false;
        expect(operator.evaluate({ religion: ["religion2"] })).to.be.false;
        expect(operator.evaluate({ religion: ["religion3"] })).to.be.false;
      });
    });
  });
});
