// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<Application /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["DEMO", "PERMISSIONS", "RESOURCES", "RESOURCE_ACTIONS", "LIMITED"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });

  it("should have known RESOURCES properties", () => {
    const clonedActions = { ...constants.RESOURCES };

    ["agency", "role"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
