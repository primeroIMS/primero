// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<AddService /> - constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["NAME", "SERVICES_SUBFORM", "SERVICES_SUBFORM_NAME"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
