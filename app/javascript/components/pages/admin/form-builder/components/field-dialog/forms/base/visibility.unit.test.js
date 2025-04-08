// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { visibilityFields, visibilityForm } from "./visibility";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/basic - visibility", () => {
  const i18n = { t: value => value };

  describe("visibilityFields", () => {
    it("should return the options fields", () => {
      const fields = visibilityFields({ fieldName: "test_1", i18n });

      expect(fields.showOn.name).toBe("test_1.show_on");
      expect(fields.visible.name).toBe("test_1.visible");
      expect(fields.mobileVisible.name).toBe("test_1.mobile_visible");
      expect(fields.hideOnViewPage.name).toBe("test_1.hide_on_view_page");
      expect(fields.showOnMinifyForm.name).toBe("test_1.show_on_minify_form");
    });
  });

  describe("visibilityForm", () => {
    it("should return the visibility form with default fields", () => {
      const form = visibilityForm({ fieldName: "test_1", i18n });
      const fieldNames = form.fields.map(field => field.name || field.row.map(rowField => rowField.name)).flat();

      expect(form.unique_id).toBe("field_visibility");
      expect(fieldNames).toEqual([
        "test_1.show_on",
        "test_1.visible",
        "test_1.mobile_visible",
        "test_1.hide_on_view_page",
        "test_1.show_on_minify_form",
        "test_1.skip_logic"
      ]);
    });

    it("should return the options form with passed fields", () => {
      const fields = visibilityFields({ fieldName: "test_1", i18n });
      const form = visibilityForm({
        fieldName: "test_1",
        i18n,
        fields: [fields.visible, fields.mobileVisible]
      });
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).toBe("field_visibility");
      expect(fieldNames).toEqual(["test_1.visible", "test_1.mobile_visible"]);
    });
  });
});
