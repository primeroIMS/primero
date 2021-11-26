import eqOperator from "./eq";

describe("eqOperator", () => {
  context("when the property is a string", () => {
    const operator = eqOperator({ sex: "male" });

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ sex: "male" })).to.be.true;
    });

    it("returns false if data does not meet the expression", () => {
      expect(operator.evaluate({ sex: "female" })).to.be.false;
    });
  });

  context("when the property is a number", () => {
    const operator = eqOperator({ age: 10 });

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ age: 10 })).to.be.true;
    });

    it("returns false if data does not meet the expression", () => {
      expect(operator.evaluate({ age: 5 })).to.be.false;
    });
  });

  context("when the property is a date", () => {
    const operator = eqOperator({ date_of_birth: "2020-08-10" });

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2020-08-10" })).to.be.true;
    });

    it("returns false if data does not meet the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2021-08-10" })).to.be.false;
    });
  });

  context("when the property is a datetime", () => {
    const operator = eqOperator({ date_of_birth: "2021-11-23T20:08:34Z" });

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2021-11-23T20:08:34Z" })).to.be.true;
    });

    it("returns false if data does not meet the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2021-11-23T21:08:34Z" })).to.be.false;
    });
  });

  context("when the property is an array", () => {
    const operator = eqOperator({ risk_level: ["high", "low"] });

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
