// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<AddIncident /> - constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["NAME", "INCIDENT_SUBFORM", "INCIDENTS_SUBFORM_NAME"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    // clone
    expect("Deprecated FIELDS_NAME").not.toHaveProperty("FIELDS_NAME");

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
