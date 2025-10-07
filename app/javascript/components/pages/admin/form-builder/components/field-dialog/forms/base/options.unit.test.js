// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { FieldRecord, TEXT_FIELD, SELECT_FIELD } from "../../../../../../../form";

import { optionsForm, optionsTabs } from "./options";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/base - options", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({ isEdit: true });
  const css = { boldLabel: "" };

  describe("optionsForm", () => {
    it("should return the options form with default fields", () => {
      const newField = FieldRecord({
        display_name: "new_field",
        name: "new_field",
        type: TEXT_FIELD
      });
      const form = optionsForm({
        fieldName: "test_1",
        i18n,
        formMode,
        field: newField,
        lookups: [],
        css
      });

      expect(form.unique_id).toBe("field_form_options");
      expect(form.fields).toHaveLength(3);
    });

    it("DEPRECATED should return the options form with passed fields", () => {
      const customField = FieldRecord({
        display_name: "Custom Field 1",
        name: "custom_field_1",
        type: TEXT_FIELD
      });

      const form = optionsForm({
        fieldName: "test_1",
        i18n,
        formMode,
        field: customField,
        lookups: [],
        css
      });
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).toBe("field_form_options");
      expect(fieldNames).not.toBe(["custom_field_1"]);
    });
  });
  describe("optionsTabs", () => {
    it("should return an array of fields", () => {
      const field = FieldRecord({
        display_name: "new_field",
        name: "new_field",
        type: SELECT_FIELD,
        option_strings_text: fromJS([{ id: "test1", disabled: false, display_text: { en: "TEST 1" } }])
      });
      const tabs = optionsTabs("test", i18n, fromJS({ isShow: false, isEdit: true }), field, fromJS([]));

      expect(tabs).toHaveLength(2);
      expect(tabs[0].name).toBe("fields.predifined_lookups");
      expect(tabs[0].disabled).toBe(true);
      expect(tabs[1].name).toBe("fields.create_unique_values");
      expect(tabs[1].disabled).toBe(false);
    });
  });
});
