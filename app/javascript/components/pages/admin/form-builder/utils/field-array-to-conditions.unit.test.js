// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import fieldArrayToConditions from "./field-array-to-conditions";

describe("fieldArrayToConditions", () => {
  it("returns an empty object when there are no conditions", () => {
    const conditionArray = [];

    expect(fieldArrayToConditions(conditionArray)).toEqual({});
  });

  it("should return a conditions object", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt" }
    ];

    const expected = { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("should return a single IN condition for an array value", () => {
    const conditionArray = [{ attribute: "field_1", value: ["value1", "value2"] }];

    const expected = { in: { field_1: ["value1", "value2"] } };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("combines the conditions using the condition type", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt", type: "and" }
    ];

    const expected = { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("groups AND conditions together separated by OR condition", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt", type: "and" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "or" },
      { attribute: "field_4", value: "value4", constraint: "lt", type: "and" }
    ];

    const expected = {
      or: [
        { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] },
        { and: [{ eq: { field_3: "value3" } }, { lt: { field_4: "value4" } }] }
      ]
    };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("groups initial OR condition with AND conditions", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "lt", type: "or" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "and" },
      { attribute: "field_4", value: "value4", constraint: "gt", type: "and" }
    ];

    const expected = {
      or: [
        { eq: { field_1: "value1" } },
        { and: [{ lt: { field_2: "value2" } }, { eq: { field_3: "value3" } }, { gt: { field_4: "value4" } }] }
      ]
    };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("groups initial AND condition with OR conditions", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "gt", type: "and" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "or" },
      { attribute: "field_4", value: "value4", constraint: "lt", type: "or" }
    ];

    const expected = {
      or: [
        { and: [{ eq: { field_1: "value1" } }, { gt: { field_2: "value2" } }] },
        { eq: { field_3: "value3" } },
        { lt: { field_4: "value4" } }
      ]
    };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("groups initial OR conditions with AND condition", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "lt", type: "or" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "or" },
      { attribute: "field_4", value: "value4", constraint: "gt", type: "and" }
    ];

    const expected = {
      or: [
        { eq: { field_1: "value1" } },
        { lt: { field_2: "value2" } },
        { and: [{ eq: { field_3: "value3" } }, { gt: { field_4: "value4" } }] }
      ]
    };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("groups OR conditions together", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "lt", type: "or" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "or" },
      { attribute: "field_4", value: "value4", constraint: "gt", type: "or" }
    ];

    const expected = {
      or: [
        { eq: { field_1: "value1" } },
        { lt: { field_2: "value2" } },
        { eq: { field_3: "value3" } },
        { gt: { field_4: "value4" } }
      ]
    };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });

  it("groups OR conditions together separated by AND condition", () => {
    const conditionArray = [
      { attribute: "field_1", value: "value1", constraint: "eq" },
      { attribute: "field_2", value: "value2", constraint: "lt", type: "or" },
      { attribute: "field_3", value: "value3", constraint: "eq", type: "and" },
      { attribute: "field_4", value: "value4", constraint: "gt", type: "or" }
    ];

    const expected = {
      or: [
        { eq: { field_1: "value1" } },
        { and: [{ lt: { field_2: "value2" } }, { eq: { field_3: "value3" } }] },
        { gt: { field_4: "value4" } }
      ]
    };

    expect(fieldArrayToConditions(conditionArray)).toEqual(expected);
  });
});
