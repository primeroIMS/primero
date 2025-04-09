// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getSelectFieldDefaultValue from "./get-select-field-default-value";

describe("getSelectFieldDefaultValue", () => {
  describe("when the selectedDefaultValue is null", () => {
    it("should return the selected default value for multi_select", () => {
      expect(getSelectFieldDefaultValue({ multi_select: true }, null)).toEqual([]);
    });

    it("should return the selected default value for multi_select", () => {
      expect(getSelectFieldDefaultValue({ multi_select: true }, "")).toEqual([]);
    });

    it("should return the selected default value for single select", () => {
      expect(getSelectFieldDefaultValue({}, null)).toBeNull();
    });
  });
});
