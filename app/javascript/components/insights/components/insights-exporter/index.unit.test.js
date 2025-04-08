// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as moduleToTest from "./index";

describe("pages/admin/forms-list/components/form-exporter/index", () => {
  const clone = { ...moduleToTest };

  afterAll(() => {
    expect(Object.keys(clone)).toHaveLength(0);
  });

  ["default"].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });
  });
});
