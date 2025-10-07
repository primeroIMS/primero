// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import conditionsToFieldArray from "./conditions-to-field-array";

describe("conditionsToFieldArray", () => {
  it("should return the AND conditions as an array", () => {
    const conditions = { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] };

    const expected = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt", type: "and" }
    ];

    expect(conditionsToFieldArray(conditions)).toEqual(expected);
  });

  it("should return a single condition as an array", () => {
    const conditions = { eq: { field_1: "value1" } };

    const expected = [{ attribute: "field_1", value: "value1", constraint: "eq" }];

    expect(conditionsToFieldArray(conditions)).toEqual(expected);
  });

  it("returns the conditions array for AND conditions", () => {
    const conditions = { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] };

    const expected = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt", type: "and" }
    ];

    expect(conditionsToFieldArray(conditions)).toEqual(expected);
  });

  it("returns 1 OR & 2 nested AND with 2 conditions conditions", () => {
    const conditions = {
      or: [
        { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] },
        { and: [{ eq: { field_3: "value3" } }, { lt: { field_4: "value4" } }] }
      ]
    };

    const expected = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt", type: "and" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "or" },
      { attribute: "field_4", value: "value4", constraint: "lt", type: "and" }
    ];

    expect(conditionsToFieldArray(conditions)).toEqual(expected);
  });

  it("returns 1 OR & 1 nested AND with 2 conditions conditions", () => {
    const conditions = {
      or: [
        { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] },
        { eq: { field_3: "value3" } },
        { lt: { field_4: "value4" } }
      ]
    };

    const expected = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt", type: "and" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "or" },
      { attribute: "field_4", value: "value4", constraint: "lt", type: "or" }
    ];

    expect(conditionsToFieldArray(conditions)).toEqual(expected);
  });

  it("returns 1 OR & 1 nested AND with 2 conditions conditions", () => {
    const conditions = {
      or: [
        { eq: { field_1: "value1" } },
        { lt: { field_2: "value2" } },
        { and: [{ eq: { field_3: "value3" } }, { gt: { field_4: "value4" } }] }
      ]
    };

    const expected = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "lt", type: "or" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "or" },
      { attribute: "field_4", value: "value4", constraint: "gt", type: "and" }
    ];

    expect(conditionsToFieldArray(conditions)).toEqual(expected);
  });

  it("returns 1 OR and 1 nested AND  with 3 conditions conditions", () => {
    const conditions = {
      or: [
        { and: [{ eq: { field_1: "value1" } }, { lt: { field_2: "value2" } }, { eq: { field_3: "value3" } }] },
        { gt: { field_4: "value4" } }
      ]
    };

    const expected = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "lt", type: "and" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "and" },
      { attribute: "field_4", value: "value4", constraint: "gt", type: "or" }
    ];

    expect(conditionsToFieldArray(conditions)).toEqual(expected);
  });
});
