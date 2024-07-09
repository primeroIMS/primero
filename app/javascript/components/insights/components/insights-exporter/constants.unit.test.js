// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("insights/components/insights-exporter/constants", () => {
  const clone = { ...constants };

  after(() => {
    expect(clone).to.be.empty;
  });

  ["NAME", "FORM_ID", "EXPORTED_URL", "EXPORT_ALL_SUBREPORTS"].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
  });
});
