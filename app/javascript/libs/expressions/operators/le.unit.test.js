import leOperator from "./le";

describe("leOperator", () => {
  context("when the property is a string", () => {
    const operator = leOperator({ sex: "male" });

    it("follows string comparison and returns true", () => {
      expect(operator.evaluate({ sex: "male" })).to.be.true;
      expect(operator.evaluate({ sex: "female" })).to.be.true;
    });

    it("follows string comparison and returns false", () => {
      expect(operator.evaluate({ sex: "none" })).to.be.false;
    });
  });

  context("when the property is a number", () => {
    const operator = leOperator({ age: 10 });

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ age: 10 })).to.be.true;
      expect(operator.evaluate({ age: 8 })).to.be.true;
    });

    it("returns false if data does not meet the expression", () => {
      expect(operator.evaluate({ age: 12 })).to.be.false;
    });
  });

  context("when the property is a date", () => {
    const operator = leOperator({ date_of_birth: "2020-08-10" });

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2020-08-10" })).to.be.true;
      expect(operator.evaluate({ date_of_birth: "2019-02-08" })).to.be.true;
    });

    it("returns false if data does not meet the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2021-05-11" })).to.be.false;
    });
  });

  context("when the property is a datetime", () => {
    const operator = leOperator({ date_of_birth: "2021-11-23T20:08:34Z" });

    it("returns true if data meets the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2021-11-23T20:08:34Z" })).to.be.true;
      expect(operator.evaluate({ date_of_birth: "2021-11-23T10:08:00Z" })).to.be.true;
    });

    it("returns false if data does not meet the expression", () => {
      expect(operator.evaluate({ date_of_birth: "2021-11-23T21:12:00Z" })).to.be.false;
    });
  });

  context("when the property is an array", () => {
    const operator = leOperator({ age: [10, 5] });

    it("throws an error because arrays are not supported", () => {
      expect(operator.evaluate).to.throw(/Invalid argument/);
    });
  });
});
