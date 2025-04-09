// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("insights/components/insights-exporter/constants", () => {
  const clone = { ...constants };

  afterAll(() => {
    expect(Object.keys(clone)).toHaveLength(0);
  });

  ["NAME", "FORM_ID", "EXPORTED_URL", "EXPORT_ALL_SUBREPORTS"].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });
  });
});
