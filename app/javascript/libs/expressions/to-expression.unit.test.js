// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import toExpression from "./to-expression";

describe("toExpression", () => {
  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: "male" }])).toEqual({ eq: { sex: "male" } });
  });

  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: "male" }, { age: 5 }])).toEqual({
      or: [{ eq: { sex: "male" } }, { eq: { age: 5 } }]
    });
  });

  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: "male", age: 5 }])).toEqual({
      and: [{ eq: { sex: "male" } }, { eq: { age: 5 } }]
    });
  });

  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: ["male", "female"], age: 5 }])).toEqual({
      and: [{ or: [{ eq: { sex: "male" } }, { eq: { sex: "female" } }] }, { eq: { age: 5 } }]
    });
  });
});
