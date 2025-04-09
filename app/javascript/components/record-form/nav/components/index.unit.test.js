// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<Nav>/components- index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
    ["NavGroup", "NavItem", "RecordInformation"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
