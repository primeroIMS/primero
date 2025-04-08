// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<ContactInformation /> - Constants", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    expect(typeof clonedConstants).toEqual("object");

    ["NAME", "FORM_ID"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
