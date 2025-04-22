// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import getValueForOptionSource from "./get-value-for-option-source";

describe("getValueForOptionSource", () => {
  const value = "UA0104053";
  const useReportingLocations = true;
  const fieldName = "incident_location";
  const recordReportingLocationHierarchy = "UA.UA01.UA0104.UA0104053";
  const reportingLocationConfig = fromJS({
    field_key: "incident_location",
    admin_level: 2,
    admin_level_map: {
      1: ["province"],
      2: ["district"]
    }
  });

  describe("when useReportingLocations is true and fieldName is incident_location", () => {
    it("should return a string with reportingLocation", () => {
      const result = getValueForOptionSource({
        value,
        useReportingLocations,
        fieldName,
        recordReportingLocationHierarchy,
        reportingLocationConfig
      });

      expect(result).toBe("UA0104");
    });
  });

  describe("when useReportingLocations is false", () => {
    it("should return passed value", () => {
      const result = getValueForOptionSource({
        value: "Testing",
        useReportingLocations: false,
        fieldName,
        recordReportingLocationHierarchy,
        reportingLocationConfig
      });

      expect(result).toBe("Testing");
    });
  });
});
