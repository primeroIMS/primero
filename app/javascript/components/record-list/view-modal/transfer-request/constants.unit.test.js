// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as transferRequestConstants from "./constants";

describe("<TransferRequest /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...transferRequestConstants };

    ["NAME", "REQUEST_FORM_NAME", "NOTES_FIELD"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
