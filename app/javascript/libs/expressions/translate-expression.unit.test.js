import translateExpression from "./translate-expression";

describe("translateExpression", () => {
  it("should translate the expression", () => {
    expect(translateExpression([{ sex: "male" }])).to.deep.equals({ eq: { sex: "male" } });
  });

  it("should translate the expression", () => {
    expect(translateExpression([{ sex: "male" }, { age: 5 }])).to.deep.equals({
      or: [{ eq: { sex: "male" } }, { eq: { age: 5 } }]
    });
  });

  it("should translate the expression", () => {
    expect(translateExpression([{ sex: "male", age: 5 }])).to.deep.equals({
      and: [{ eq: { sex: "male" } }, { eq: { age: 5 } }]
    });
  });

  it("should translate the expression", () => {
    expect(translateExpression([{ sex: ["male", "female"], age: 5 }])).to.deep.equals({
      and: [{ or: [{ eq: { sex: "male" } }, { eq: { sex: "female" } }] }, { eq: { age: 5 } }]
    });
  });
});
