// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { STRING_SOURCES_TYPES } from "../config";

import valueFromOptionSource from "./value-from-option-source";

describe("valueFromOptionSource", () => {
  const allAgencies = [
    {
      id: "agency-one",
      display_text: "Agency 1"
    },
    {
      id: "agency-two",
      display_text: "Agency 2"
    }
  ];
  const allLookups = fromJS([
    {
      id: 1,
      unique_id: "lookup-gender",
      name: {
        en: "Gender"
      },
      values: [
        {
          id: "male",
          display_text: {
            en: "Male"
          }
        },
        {
          id: "female",
          display_text: {
            en: "Female"
          }
        },
        {
          id: "other",
          display_text: {
            en: "Other"
          }
        }
      ]
    }
  ]);
  const locations = [
    {
      id: "country1",
      display_text: "Country "
    },
    {
      id: "city1",
      display_text: "City 1"
    }
  ];
  const fieldValue = fromJS(["female", "male"]);

  describe("when the value is List", () => {
    it("should return the display text for each value", () => {
      const result = valueFromOptionSource(
        allAgencies,
        allLookups,
        locations,
        "en",
        "lookup lookup-gender",
        fieldValue
      );

      expect(result).toEqual(fromJS(["Female", "Male"]));
    });
  });

  describe("when is the value is a string", () => {
    it("should return the display text for each value", () => {
      const result = valueFromOptionSource(allAgencies, allLookups, locations, "en", "lookup lookup-gender", "female");

      expect(result).toEqual("Female");
    });
  });

  describe("when is the value is an agency", () => {
    it("should return the display text for each value", () => {
      const result = valueFromOptionSource(
        allAgencies,
        allLookups,
        locations,
        "en",
        STRING_SOURCES_TYPES.AGENCY,
        "agency-one"
      );

      expect(result).toEqual("Agency 1");
    });
  });

  describe("when is the value is a location", () => {
    it("should return the display text for each value", () => {
      const result = valueFromOptionSource(
        allAgencies,
        allLookups,
        locations,
        "en",
        STRING_SOURCES_TYPES.LOCATION,
        "city1"
      );

      expect(result).toEqual("City 1");
    });
  });
});
