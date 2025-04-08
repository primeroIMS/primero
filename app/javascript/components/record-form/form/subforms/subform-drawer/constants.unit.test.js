// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<RecordForm>/form/subforms/<SubformDrawer> - constants", () => {
  let clone;

  beforeAll(() => {
    clone = { ...constants };
  });

  it("should have known constant", () => {
    ["NAME"].forEach(property => {
      expect(clone).toHaveProperty(property);
      expect(typeof clone[property]).toBe("string");
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
