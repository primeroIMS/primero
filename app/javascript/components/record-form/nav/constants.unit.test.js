// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as navConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...navConstants };

    ["NAME", "CUSTOM_FORM_IDS_NAV"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(constants).toEqual({});
  });
});
