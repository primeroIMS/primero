// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<AgenciesList /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    expect(typeof clonedActions).toEqual("object");
    ["NAME", "DISABLED"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
