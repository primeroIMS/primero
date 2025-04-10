// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildCollapsedFields from "./build-collapsed-fields";

describe("buildCollapsedFields", () => {
  const i18n = { t: v => v };

  describe("when collapsedFieldNames or fields are empty", () => {
    it("should return empty array", () => {
      const result = buildCollapsedFields({});

      expect(result).toEqual([]);
    });
  });

  describe("when formikValues and parentValues are present", () => {
    it("should return the values for subform", () => {
      const values = {
        perpetrators: [
          { unique_id: "abc123", perpetrators_name: "perp A" },
          { unique_id: "def456", perpetrators_name: "perp B" }
        ]
      };
      const result = buildCollapsedFields({
        collapsedFieldNames: ["perpetrators_name"],
        values,
        fields: fromJS([{ type: "text_field", name: "perpetrators_name" }]),
        i18n
      });

      expect(result[0].type).toBe("span");
    });
  });
});
