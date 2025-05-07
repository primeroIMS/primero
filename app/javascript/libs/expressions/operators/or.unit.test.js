// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import orOperator from "./or";
import andOperator from "./and";
import eqOperator from "./eq";
import gtOperator from "./gt";

describe("orOperator", () => {
  describe("when comparison operators are used", () => {
    const operator = orOperator([eqOperator({ sex: "male" }), gtOperator({ age: 8 })]);

    describe("when the data is immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 10 }))).toBe(true);
        expect(operator.evaluate(fromJS({ sex: "female", age: 10 }))).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate(fromJS({ sex: "female", age: 8 }))).toBe(false);
        expect(operator.evaluate(fromJS({ sex: "female", age: 5 }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate({ sex: "male", age: 10 })).toBe(true);
        expect(operator.evaluate({ sex: "female", age: 10 })).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate({ sex: "female", age: 8 })).toBe(false);
        expect(operator.evaluate({ sex: "female", age: 5 })).toBe(false);
      });
    });
  });

  describe("when logical operator are used", () => {
    const operator = orOperator([
      andOperator([eqOperator({ sex: "male" }), gtOperator({ age: 8 })]),
      eqOperator({ sex: "female" })
    ]);

    describe("when the data is immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 10 }))).toBe(true);
        expect(operator.evaluate(fromJS({ sex: "female" }))).toBe(true);
        expect(operator.evaluate(fromJS({ sex: "female", age: 5 }))).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 8 }))).toBe(false);
        expect(operator.evaluate(fromJS({ age: 9 }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate({ sex: "male", age: 10 })).toBe(true);
        expect(operator.evaluate({ sex: "female" })).toBe(true);
        expect(operator.evaluate({ sex: "female", age: 5 })).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate({ sex: "male", age: 8 })).toBe(false);
        expect(operator.evaluate({ age: 9 })).toBe(false);
      });
    });
  });
});
