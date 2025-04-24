// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<Transitions /> - index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    [
      "default",
      "fetchTransitions",
      "getTransitionById",
      "reducer",
      "selectTransitions",
      "selectTransitionByTypeAndStatus"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
