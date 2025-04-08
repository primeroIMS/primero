// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import convertToFieldsObject from "./convert-to-fields-object";

describe("convertToFieldsObject", () => {
  it("should return the fields as a single object", () => {
    const fields = [
      { name: "field_1", visible: false },
      { name: "field_2", visible: true }
    ];
    const expected = {
      field_1: { name: "field_1", visible: false },
      field_2: { name: "field_2", visible: true }
    };

    expect(convertToFieldsObject(fields)).toEqual(expected);
  });
});
