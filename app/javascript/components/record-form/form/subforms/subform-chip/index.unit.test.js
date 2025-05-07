// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as indexValues from "./index";

describe("<RecordForm>/form/subforms/<SubformChip> - index", () => {
  const clone = { ...indexValues };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    ["default"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });
    expect(Object.keys(clone)).toHaveLength(0);
  });
});
