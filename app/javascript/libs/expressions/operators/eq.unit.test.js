// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import eqOperator from "./eq";

describe("eqOperator", () => {
  describe("when the property is a string", () => {
    const operator = eqOperator({ sex: "male" });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "male" }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female" }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ sex: "male" })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ sex: "female" })).toBe(false);
      });
    });
  });

  describe("when the property is a number", () => {
    const operator = eqOperator({ age: 10 });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ age: 10 }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ age: 5 }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ age: 10 })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ age: 5 })).toBe(false);
      });
    });
  });

  describe("when the property is a date", () => {
    const operator = eqOperator({ date_of_birth: "2020-08-10" });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2020-08-10" }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-08-10" }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2020-08-10" })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-08-10" })).toBe(false);
      });
    });
  });

  describe("when the property is a datetime", () => {
    const operator = eqOperator({ date_of_birth: "2021-11-23T20:08:34Z" });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T20:08:34Z" }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ date_of_birth: "2021-11-23T21:08:34Z" }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T20:08:34Z" })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ date_of_birth: "2021-11-23T21:08:34Z" })).toBe(false);
      });
    });
  });

  describe("when the property is an array", () => {
    const operator = eqOperator({ risk_level: ["high", "low"] });

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ risk_level: ["high", "low"] }))).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate(fromJS({ risk_level: ["medium", "low"] }))).toBe(false);
        expect(operator.evaluate(fromJS({ risk_level: ["low"] }))).toBe(false);
        expect(operator.evaluate(fromJS({ risk_level: ["high"] }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ risk_level: ["high", "low"] })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ risk_level: ["medium", "low"] })).toBe(false);
        expect(operator.evaluate({ risk_level: ["low"] })).toBe(false);
        expect(operator.evaluate({ risk_level: ["high"] })).toBe(false);
      });
    });
  });

  describe("when the property is false", () => {
    const operator = eqOperator({ permitted: false });

    describe("when the data is immutable", () => {
      it("returns true if data is undefined", () => {
        expect(operator.evaluate(fromJS({}))).toBe(true);
      });

      it("returns true if data is null", () => {
        expect(operator.evaluate(fromJS({ permitted: null }))).toBe(true);
      });

      it("returns true if data is false", () => {
        expect(operator.evaluate(fromJS({ permitted: false }))).toBe(true);
      });

      it("returns false if data is true", () => {
        expect(operator.evaluate(fromJS({ permitted: true }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data is undefined", () => {
        expect(operator.evaluate({})).toBe(true);
      });

      it("returns true if data is null", () => {
        expect(operator.evaluate({ permitted: null })).toBe(true);
      });

      it("returns false if data does not meet the expression", () => {
        expect(operator.evaluate({ permitted: true })).toBe(false);
      });
    });
  });
});
