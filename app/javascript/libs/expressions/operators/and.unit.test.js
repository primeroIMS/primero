// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import andOperator from "./and";
import orOperator from "./or";
import eqOperator from "./eq";
import gtOperator from "./gt";

describe("andOperator", () => {
  describe("when comparison operators are used", () => {
    const operator = andOperator([eqOperator({ sex: "male" }), gtOperator({ age: 8 })]);

    describe("when the data is immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 10 }))).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 5 }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate({ sex: "male", age: 10 })).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate({ sex: "male", age: 5 })).toBe(false);
      });
    });
  });

  describe("when logical operator are used", () => {
    const operator = andOperator([
      orOperator([eqOperator({ sex: "male" }), gtOperator({ age: 8 })]),
      eqOperator({ nationality: "country1" })
    ]);

    describe("when the data is immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate(fromJS({ sex: "male", nationality: "country1" }))).toBe(true);
        expect(operator.evaluate(fromJS({ age: 10, nationality: "country1" }))).toBe(true);
        expect(operator.evaluate(fromJS({ sex: "female", age: 10, nationality: "country1" }))).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate(fromJS({ sex: "male", age: 5 }))).toBe(false);
        expect(operator.evaluate(fromJS({ sex: "male", age: 8, nationality: "country2" }))).toBe(false);
        expect(operator.evaluate(fromJS({ sex: "female", age: 5, nationality: "country1" }))).toBe(false);
        expect(operator.evaluate(fromJS({ age: 2, nationality: "country1" }))).toBe(false);
        expect(operator.evaluate(fromJS({ sex: "male", nationality: "country2" }))).toBe(false);
      });
    });

    describe("when the data is not immutable", () => {
      it("should return true", () => {
        expect(operator.evaluate({ sex: "male", nationality: "country1" })).toBe(true);
        expect(operator.evaluate({ age: 10, nationality: "country1" })).toBe(true);
        expect(operator.evaluate({ sex: "female", age: 10, nationality: "country1" })).toBe(true);
      });

      it("should return false", () => {
        expect(operator.evaluate({ sex: "male", age: 5 })).toBe(false);
        expect(operator.evaluate({ sex: "male", age: 8, nationality: "country2" })).toBe(false);
        expect(operator.evaluate({ sex: "female", age: 5, nationality: "country1" })).toBe(false);
        expect(operator.evaluate({ age: 2, nationality: "country1" })).toBe(false);
        expect(operator.evaluate({ sex: "male", nationality: "country2" })).toBe(false);
      });
    });
  });
});
