// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import ltOperator from "./lt";

describe("ltOperator", () => {
  context("when the property is a string", () => {
    const operator = ltOperator({ sex: "male" });

    context("when the data is immutable", () => {
      it("follows string comparison and returns true", () => {
        expect(operator.evaluate(fromJS({ sex: "female" }))).to.be.true;
      });

      it("follows string comparison and returns false", () => {
        expect(operator.evaluate(fromJS({ sex: "male" }))).to.be.false;
        expect(operator.evaluate(fromJS({ sex: "none" }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("follows string comparison and returns true", () => {
        expect(operator.evaluate({ sex: "female" })).to.be.true;
      });

      it("follows string comparison and returns false", () => {
        expect(operator.evaluate({ sex: "male" })).to.be.false;
        expect(operator.evaluate({ sex: "none" })).to.be.false;
      });
    });
  });

  context("when the property is a number", () => {
    const operator = ltOperator({ age: 10 });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ age: 5 }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ age: 10 }))).to.be.false;
        expect(operator.evaluate(fromJS({ age: 12 }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ age: 5 })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ age: 10 })).to.be.false;
        expect(operator.evaluate({ age: 12 })).to.be.false;
      });
    });
  });

  context("when the property is a date", () => {
    const operator = ltOperator({ date_of_birth: "2020-08-10" });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2019-02-08" }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2020-08-10" }))).to.be.false;
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-05-11" }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2019-02-08" })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2020-08-10" })).to.be.false;
        expect(operator.evaluate({ date_of_birth: "2021-05-11" })).to.be.false;
      });
    });
  });

  context("when the property is a datetime", () => {
    const operator = ltOperator({ date_of_birth: "2021-11-23T20:08:34Z" });

    context("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T10:08:00Z" }))).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T21:12:00Z" }))).to.be.false;
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T20:08:34Z" }))).to.be.false;
      });
    });

    context("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T10:08:00Z" })).to.be.true;
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T21:12:00Z" })).to.be.false;
        expect(operator.evaluate({ date_of_birth: "2021-11-23T20:08:34Z" })).to.be.false;
      });
    });
  });

  context("when the property is an array", () => {
    const operator = ltOperator({ age: [10, 5] });

    context("when the data is immutable", () => {
      it("throws an error because arrays are not supported", () => {
        expect(() => operator.evaluate(fromJS({ age: 10 }))).to.throw(/Invalid argument/);
      });
    });

    context("when the data is not immutable", () => {
      it("throws an error because arrays are not supported", () => {
        expect(() => operator.evaluate({ age: 10 })).to.throw(/Invalid argument/);
      });
    });
  });
});
