// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import convertToFieldsArray from "./convert-to-fields-array";

describe("convertToFieldsArray", () => {
  it("should return the fields as an array", () => {
    const fields = {
      field_1: { name: "field_1", visible: false },
      field_2: { name: "field_2", visible: true }
    };

    const expected = [
      { name: "field_1", visible: false },
      { name: "field_2", visible: true }
    ];

    expect(convertToFieldsArray(fields)).toEqual(expected);
  });
});
