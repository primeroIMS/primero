// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import ltOperator from "./lt";

describe("ltOperator", () => {
  describe("when the property is a string", () => {
    const operator = ltOperator({ sex: "male" });

    describe("when the data is immutable", () => {
      it("follows string comparison and returns true", () => {
        expect(operator.evaluate(fromJS({ sex: "female" }))).toBe(true);
      });

      it("follows string comparison and returns false", () => {
        expect(operator.evaluate(fromJS({ sex: "male" }))).toBe(false);
        expect(operator.evaluate(fromJS({ sex: "none" }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("follows string comparison and returns true", () => {
        expect(operator.evaluate({ sex: "female" })).toBe(true);
      });

      it("follows string comparison and returns false", () => {
        expect(operator.evaluate({ sex: "male" })).toBe(false);
        expect(operator.evaluate({ sex: "none" })).toBe(false);
      });
    });
  });

  describe("when the property is a number", () => {
    const operator = ltOperator({ age: 10 });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ age: 5 }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ age: 10 }))).toBe(false);
        expect(operator.evaluate(fromJS({ age: 12 }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ age: 5 })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ age: 10 })).toBe(false);
        expect(operator.evaluate({ age: 12 })).toBe(false);
      });
    });
  });

  describe("when the property is a date", () => {
    const operator = ltOperator({ date_of_birth: "2020-08-10" });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2019-02-08" }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2020-08-10" }))).toBe(false);
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-05-11" }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2019-02-08" })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2020-08-10" })).toBe(false);
        expect(operator.evaluate({ date_of_birth: "2021-05-11" })).toBe(false);
      });
    });
  });

  describe("when the property is a datetime", () => {
    const operator = ltOperator({ date_of_birth: "2021-11-23T20:08:34Z" });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T10:08:00Z" }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T21:12:00Z" }))).toBe(false);
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T20:08:34Z" }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T10:08:00Z" })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T21:12:00Z" })).toBe(false);
        expect(operator.evaluate({ date_of_birth: "2021-11-23T20:08:34Z" })).toBe(false);
      });
    });
  });

  describe("when the property is an array", () => {
    const operator = ltOperator({ age: [10, 5] });

    describe("when the data is immutable", () => {
      it("throws an error because arrays are not supported", () => {
        expect(() => operator.evaluate(fromJS({ age: 10 }))).toThrow(/Invalid argument/);
      });
    });

    describe("when the data is not immutable", () => {
      it("throws an error because arrays are not supported", () => {
        expect(() => operator.evaluate({ age: 10 })).toThrow(/Invalid argument/);
      });
    });
  });
});
