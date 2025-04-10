// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<UsersList /> - constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(typeof clone).toEqual("object");
    ["AGENCY", "DISABLED", "LIST_HEADERS", "USER_GROUP"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
