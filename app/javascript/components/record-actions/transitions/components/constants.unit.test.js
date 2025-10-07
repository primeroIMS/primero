// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<Transitions /> - record-actions/transitions/components/constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["REASSIGN_FORM_NAME"].forEach(property => {
      expect(clone).toHaveProperty(property);
      expect(typeof clone[property]).toBe("string");
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
