// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as permissionsConstants from "./constants";

describe("Verifying user constant", () => {
  it("should have known constant", () => {
    const constants = { ...permissionsConstants };

    ["PERMISSIONS", "LIST_HEADERS", "PERMITTED_FORMS", "SELECTED_IDP"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
