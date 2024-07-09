// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<FormBuilder />/components/<FieldListItem /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["NAME", "SUBFORM_GROUP_BY", "SUBFORM_SECTION_CONFIGURATION", "SUBFORM_SORT_BY"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
