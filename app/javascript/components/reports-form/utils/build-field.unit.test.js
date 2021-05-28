import { expect } from "chai";
import { fromJS } from "immutable";

import { buildField, buildLocationFields } from "./build-field";

describe("<ReportForm>/utils/build-field", () => {
  describe("buildField()", () => {
    const field = fromJS({
      name: "field_1",
      display_name: { en: "Field 1" },
      type: "text_field"
    });

    it("returns the correct object", () => {
      const expected = {
        id: "field_1",
        display_text: "Field 1",
        formSection: "Form 1",
        type: "text_field",
        option_strings_source: undefined,
        option_strings_text: undefined,
        tick_box_label: undefined
      };

      expect(buildField(field, "Form 1", "en")).to.deep.equal(expected);
    });
  });

  describe("buildLocationFields()", () => {
    const field = fromJS({
      name: "location",
      display_name: { en: "Location" },
      type: "select_field",
      option_strings_source: "Location"
    });

    it("returns all the location fields for the admin level", () => {
      const locationField = {
        id: "location",
        display_text: "Location",
        formSection: "Form 1",
        type: "select_field",
        option_strings_source: "Location",
        option_strings_text: undefined,
        tick_box_label: undefined
      };

      const reportingLocationConfig = fromJS({
        admin_level: 2,
        admin_level_map: {
          1: ["city"],
          2: ["district"]
        }
      });

      const i18n = { locale: "en", t: value => value };

      const expected = [
        locationField,
        { ...locationField, id: "location1", display_text: "Location (location.base_types.city)" },
        { ...locationField, id: "location2", display_text: "Location (location.base_types.district)" }
      ];

      expect(buildLocationFields(field, "Form 1", i18n, reportingLocationConfig)).to.deep.equal(expected);
    });
  });
});
