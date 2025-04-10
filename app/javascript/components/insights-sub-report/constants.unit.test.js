// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<InsightsSubReport /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    [
      "COMBINED_INDICATORS",
      "GROUPED_BY_FILTER",
      "NAME",
      "GHN_VIOLATIONS_INDICATORS_IDS",
      "REPORTING_LOCATION_INSIGHTS",
      "PERCENTAGE_INDICATORS"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
