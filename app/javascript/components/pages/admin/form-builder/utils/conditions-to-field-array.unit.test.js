import conditionsToFieldArray from "./conditions-to-field-array";

describe("conditionsToFieldArray", () => {
  it("should return the AND conditions as an array", () => {
    const conditions = { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] };

    const expected = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt" }
    ];

    expect(conditionsToFieldArray(conditions)).to.deep.equal(expected);
  });

  it("should return a single condition as an array", () => {
    const conditions = { eq: { field_1: "value1" } };

    const expected = [{ attribute: "field_1", value: "value1", constraint: "eq" }];

    expect(conditionsToFieldArray(conditions)).to.deep.equal(expected);
  });

  it("should return create a not null constraint", () => {
    const conditions = { not: { eq: { field_1: "" } } };

    const expected = { attribute: "field_1", constraint: "not_null" };

    expect(conditionsToFieldArray(conditions)).to.deep.equal(expected);
  });
});
