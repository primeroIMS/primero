import { fromJS } from "immutable";

import { OPTION_TYPES } from "../form/constants";

import getFieldValueFromOptionSource from "./utils";

describe("getFieldValueFromOptionSource", () => {
  const allAgencies = fromJS([
    {
      id: 1,
      unique_id: "agency-one",
      name: {
        en: "Agency 1"
      }
    }
  ]);
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

  context("when the value is List", () => {
    it("should return the display text for each value", () => {
      const result = getFieldValueFromOptionSource(
        allAgencies,
        allLookups,
        locations,
        "en",
        "lookup lookup-gender",
        fieldValue
      );

      expect(result).to.deep.equal(fromJS(["Female", "Male"]));
    });
  });

  context("when is the value is a string", () => {
    it("should return the display text for each value", () => {
      const result = getFieldValueFromOptionSource(
        allAgencies,
        allLookups,
        locations,
        "en",
        "lookup lookup-gender",
        "female"
      );

      expect(result).to.deep.equal("Female");
    });
  });

  context("when is the value is an agency", () => {
    it("should return the display text for each value", () => {
      const result = getFieldValueFromOptionSource(allAgencies, allLookups, locations, "en", OPTION_TYPES.AGENCY, 1);

      expect(result).to.deep.equal("Agency 1");
    });
  });

  context("when is the value is a location", () => {
    it("should return the display text for each value", () => {
      const result = getFieldValueFromOptionSource(
        allAgencies,
        allLookups,
        locations,
        "en",
        OPTION_TYPES.LOCATION,
        "city1"
      );

      expect(result).to.deep.equal("City 1");
    });
  });
});
