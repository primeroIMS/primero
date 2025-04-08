// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<CustomFieldDialog /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["CUSTOM_FIELD_DIALOG", "NAME"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
