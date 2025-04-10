// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<RecordActions /> - exports/actions", () => {
  const clone = { ...actions };

  it("should have known actions", () => {
    expect(typeof clone).toEqual("object");
    ["EXPORT"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
