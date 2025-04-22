// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("pages/admin/<RolesForm> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["default", "NAMESPACE", "reducer"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
