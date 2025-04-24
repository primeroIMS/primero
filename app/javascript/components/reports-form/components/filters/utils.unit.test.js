// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SELECT_FIELD, TICK_FIELD } from "../../../form";
import { NOT_NULL } from "../../constants";

import * as utils from "./utils";

describe("<ReportFilters /> - utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["formatValue", "onFilterDialogSuccess", "registerValues"].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("formatValue()", () => {
    const i18n = { t: item => item, locale: "en" };

    it("should return a formatted date field if value is a valid date object", () => {
      const value = new Date("01/01/2020");

      expect(utils.formatValue(value, i18n, { field: {}, lookups: {} })).toBe("01-Jan-2020");
    });

    describe("when field type is tick-field type", () => {
      const field = {
        type: TICK_FIELD
      };

      it("should return the value of tick_box_label included in the field", () => {
        const value = [true];

        expect(
          utils.formatValue(value, i18n, {
            field: { ...field, tick_box_label: { en: "test" } },
            lookups: {}
          })
        ).toBe("test");
      });
      it("should return true if the value includes true and if there's not tick_box_label", () => {
        const value = [true];

        expect(
          utils.formatValue(value, i18n, {
            field,
            lookups: {}
          })
        ).toBe("true");
      });
      it("should return not selected if the value doesn't include true", () => {
        const value = [false];

        expect(
          utils.formatValue(value, i18n, {
            field,
            lookups: {}
          })
        ).toBe("report.not_selected");
      });
    });

    describe("when field type is select-field or radio-button-field type", () => {
      const field = {
        type: SELECT_FIELD
      };

      it("should return an empty array if value includes not_null", () => {
        const value = [NOT_NULL];

        expect(
          utils.formatValue(value, i18n, {
            field,
            lookups: {}
          })
        ).toHaveLength(0);
      });

      it("should return translated values if field contains the option_strings_source prop", () => {
        const value = ["opt1"];
        const lookups = [
          {
            unique_id: "test_lookup",
            values: [{ id: "opt1", display_text: "Option 1" }]
          }
        ];

        expect(
          utils.formatValue(value, i18n, {
            field: { ...field, option_strings_source: "test_lookup" },
            lookups
          })
        ).toBe("Option 1");
      });

      it("should return translated values if field contains the option_strings_text ", () => {
        const value = ["test1"];
        const optionStringTexts = [
          {
            id: "test1",
            display_text: { en: "Test 1" }
          }
        ];

        expect(
          utils.formatValue(value, i18n, {
            field: { ...field, option_strings_text: optionStringTexts },
            lookups: {}
          })
        ).toBe("Test 1");
      });

      it("should return agency values if field contains agency on the option_strings_source prop", () => {
        const value = ["agency-1"];
        const lookups = [
          {
            unique_id: "Agency",
            values: [{ id: "agency-1", display_text: "Agency 1" }]
          }
        ];

        expect(
          utils.formatValue(value, i18n, {
            field: { ...field, option_strings_source: "Agency" },
            lookups
          })
        ).toBe("Agency 1");
      });
    });
  });
});
