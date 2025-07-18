// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("ChangeLogs - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    [
      "APPROVALS",
      "CREATE_ACTION",
      "EMPTY_VALUE",
      "EXCLUDED_LOG_ACTIONS",
      "INCIDENTS",
      "NAME",
      "SUBFORM",
      "TYPE"
    ].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
