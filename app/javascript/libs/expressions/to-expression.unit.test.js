import toExpression from "./to-expression";

describe("toExpression", () => {
  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: "male" }])).to.deep.equals({ eq: { sex: "male" } });
  });

  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: "male" }, { age: 5 }])).to.deep.equals({
      or: [{ eq: { sex: "male" } }, { eq: { age: 5 } }]
    });
  });

  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: "male", age: 5 }])).to.deep.equals({
      and: [{ eq: { sex: "male" } }, { eq: { age: 5 } }]
    });
  });

  it("converts the condition to an expression", () => {
    expect(toExpression([{ sex: ["male", "female"], age: 5 }])).to.deep.equals({
      and: [{ or: [{ eq: { sex: "male" } }, { eq: { sex: "female" } }] }, { eq: { age: 5 } }]
    });
  });
});
