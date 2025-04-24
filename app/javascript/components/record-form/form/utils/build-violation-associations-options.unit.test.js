// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildViolationAssociationsOptions from "./build-violation-associations-options";

describe("buildViolationAssociationsOptions", () => {
  const i18n = { t: v => v };

  describe("when formikValues and parentValues are empty", () => {
    it("should return enpty array", () => {
      const formikValues = {};
      const parentValues = {};
      const result = buildViolationAssociationsOptions(
        "perpetrators",
        formikValues,
        parentValues,
        ["perpetrators_name"],
        fromJS([]),
        i18n
      );

      expect(result).toEqual([]);
    });
  });
  describe("when formikValues and parentValues are present", () => {
    it("should return the values for subform", () => {
      const formikValues = { perpetrators: [{ unique_id: "abc123", perpetrators_name: "perp A" }] };
      const parentValues = { perpetrators: [{ unique_id: "def456", perpetrators_name: "perp B" }] };
      const result = buildViolationAssociationsOptions({
        fieldName: "perpetrators",
        formikValues,
        parentValues,
        collapsedFields: ["perpetrators_name"],
        fields: fromJS([{ type: "text_field", name: "perpetrators_name" }]),
        i18n
      });

      expect(result[0]).toEqual({ id: "new", value: "buttons.new" });
      expect(result[1].id).toBe("def456");
    });
  });
});
