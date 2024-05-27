// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<InsightsSubReport /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "COMBINED_INDICATORS",
      "GROUPED_BY_FILTER",
      "NAME",
      "GHN_VIOLATIONS_INDICATORS_IDS",
      "REPORTING_LOCATION_INSIGHTS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
