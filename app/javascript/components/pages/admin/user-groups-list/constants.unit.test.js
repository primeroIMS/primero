// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<UserGroupsList /> - Constants", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    expect(clonedConstants).to.be.an("object");

    ["AGENCY_UNIQUE_IDS", "DISABLED", "NAME", "MANAGED"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
