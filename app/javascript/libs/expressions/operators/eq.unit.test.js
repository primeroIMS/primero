import { fromJS } from "immutable";

import eqOperator from "./eq";

describe("eqOperator", () => {
  context("when the property is a string", () => {
    const operator = eqOperator({ sex: "male" });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "male" }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female" }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ sex: "male" })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ sex: "female" })).to.be.false;
      });
    });
  });

  context("when the property is a number", () => {
    const operator = eqOperator({ age: 10 });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ age: 10 }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ age: 5 }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ age: 10 })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ age: 5 })).to.be.false;
      });
    });
  });

  context("when the property is a date", () => {
    const operator = eqOperator({ date_of_birth: "2020-08-10" });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2020-08-10" }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-08-10" }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2020-08-10" })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-08-10" })).to.be.false;
      });
    });
  });

  context("when the property is a datetime", () => {
    const operator = eqOperator({ date_of_birth: "2021-11-23T20:08:34Z" });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T20:08:34Z" }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T21:08:34Z" }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T20:08:34Z" })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T21:08:34Z" })).to.be.false;
      });
    });
  });

  context("when the property is an array", () => {
    const operator = eqOperator({ risk_level: ["high", "low"] });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ risk_level: ["high", "low"] }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ risk_level: ["medium", "low"] }))).to.be.false;
        expect(operator.evaluate(fromJS({ risk_level: ["low"] }))).to.be.false;
        expect(operator.evaluate(fromJS({ risk_level: ["high"] }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ risk_level: ["high", "low"] })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ risk_level: ["medium", "low"] })).to.be.false;
        expect(operator.evaluate({ risk_level: ["low"] })).to.be.false;
        expect(operator.evaluate({ risk_level: ["high"] })).to.be.false;
      });
    });
  });

  context("when the property is false", () => {
    const operator = eqOperator({ permitted: false });

    context("when the data is immutable", () => {
      it("returns true if data is undefined", () => {
        expect(operator.evaluate(fromJS({}))).to.be.true;
      });

      it("returns true if data is null", () => {
        expect(operator.evaluate(fromJS({ permitted: null }))).to.be.true;
      });

      it("returns true if data is false", () => {
        expect(operator.evaluate(fromJS({ permitted: false }))).to.be.true;
      });

      it("returns false if data is true", () => {
        expect(operator.evaluate(fromJS({ permitted: true }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data is undefined", () => {
        expect(operator.evaluate({})).to.be.true;
      });

      it("returns true if data is null", () => {
        expect(operator.evaluate({ permitted: null })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ permitted: true })).to.be.false;
      });
    });
  });
});
