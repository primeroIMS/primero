// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { buildField, buildLocationFields, buildMinimumLocationField } from "./build-field";

describe("<ReportForm>/utils/build-field", () => {
  describe("buildField()", () => {
    const field = fromJS({
      name: "field_1",
      display_name: { en: "Field 1" },
      type: "text_field",
      visible: true
    });

    it("returns the correct object", () => {
      const expected = {
        id: "field_1",
        display_text: "Field 1",
        formSection: "Form 1",
        type: "text_field",
        option_strings_source: undefined,
        option_strings_text: undefined,
        tick_box_label: undefined,
        visible: true
      };

      expect(buildField(field, "Form 1", "en")).toEqual(expected);
    });
  });

  describe("buildLocationFields()", () => {
    const field = fromJS({
      name: "location",
      display_name: { en: "Location" },
      type: "select_field",
      option_strings_source: "Location",
      visible: true
    });

    it("returns the location field and a location field for each level in the admin_level_map", () => {
      const locationField = {
        id: "loc:location",
        display_text: "Location",
        formSection: "Form 1",
        type: "select_field",
        option_strings_source: "Location",
        option_strings_text: undefined,
        tick_box_label: undefined,
        visible: true
      };

      const reportingLocationConfig = fromJS({
        admin_level: 2,
        admin_level_map: {
          0: ["country"],
          1: ["city"],
          2: ["district"]
        }
      });

      const i18n = { locale: "en", t: value => value };

      const expected = [
        locationField,
        { ...locationField, id: "loc:location0", display_text: "Location (location.base_types.country)" },
        { ...locationField, id: "loc:location1", display_text: "Location (location.base_types.city)", visible: true },
        {
          ...locationField,
          id: "loc:location2",
          display_text: "Location (location.base_types.district)",
          visible: true
        }
      ];

      expect(buildLocationFields(field, "Form 1", i18n, reportingLocationConfig)).toEqual(expected);
    });
  });

  describe("buildMinimumLocationField()", () => {
    const locationField = {
      id: "owned_by_location",
      display_text: "Owner's Location",
      formSection: "Form 1",
      type: "select_field",
      option_strings_source: "Location",
      option_strings_text: undefined,
      tick_box_label: undefined,
      visible: true
    };

    it("returns all the location fields for the admin level", () => {
      const reportingLocationConfig = fromJS({
        admin_level: 2,
        admin_level_map: {
          0: ["country"],
          1: ["city"],
          2: ["district"]
        }
      });

      const i18n = { locale: "en", t: value => value };

      const expected = [
        { ...locationField, id: "owned_by_location0", display_text: "Owner's Location (location.base_types.country)" },
        {
          ...locationField,
          id: "owned_by_location1",
          display_text: "Owner's Location (location.base_types.city)",
          visible: true
        },
        {
          ...locationField,
          id: "owned_by_location2",
          display_text: "Owner's Location (location.base_types.district)",
          visible: true
        }
      ];

      expect(buildMinimumLocationField(locationField, i18n, reportingLocationConfig)).toEqual(expected);
    });
  });
});
