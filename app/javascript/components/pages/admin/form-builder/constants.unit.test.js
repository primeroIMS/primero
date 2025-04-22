// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<FormBuilder /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    [
      "NAME",
      "NESTED_DATA_FIELDS",
      "NEW_FIELD",
      "MODULES_FIELD",
      "RECORD_TYPE_FIELD",
      "SKIP_LOGIC_FIELD",
      "FORM_GROUP_FIELD",
      "FORM_ID"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
