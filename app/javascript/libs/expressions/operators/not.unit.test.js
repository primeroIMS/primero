// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import notOperator from "./not";
import eqOperator from "./eq";
import orOperator from "./or";

describe("notOperator", () => {
  describe("when a comparison operator is used", () => {
    const operator = notOperator(eqOperator({ sex: "male" }));

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 5 }))).toBe(true);
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 5 }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ sex: "female", age: 5 })).toBe(true);
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate({ sex: "male", age: 5 })).toBe(false);
      });
    });
  });

  describe("when a logical operator is used", () => {
    const operator = notOperator(orOperator([eqOperator({ sex: "male" }), eqOperator({ age: 5 })]));

    describe("when the data is immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 10 }))).toBe(true);
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 5 }))).toBe(false);
        expect(operator.evaluate(fromJS({ sex: "male", age: 10 }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("returns true if data meets the expression", () => {
        expect(operator.evaluate({ sex: "female", age: 10 })).toBe(true);
      });

      it("returns false if data meets the expression", () => {
        expect(operator.evaluate({ sex: "female", age: 5 })).toBe(false);
        expect(operator.evaluate({ sex: "male", age: 10 })).toBe(false);
      });
    });
  });

  describe("throws an error if an array of operators is passed", () => {
    const operator = notOperator([eqOperator({ sex: "male" }), eqOperator({ age: 5 })]);

    it("when the data is immutable", () => {
      expect(() => operator.evaluate(fromJS({ sex: "male" }))).toThrow(/Invalid expression/);
    });

    it("when the data is not immutable", () => {
      expect(() => operator.evaluate({ sex: "male" })).toThrow(/Invalid expression/);
    });
  });
});
