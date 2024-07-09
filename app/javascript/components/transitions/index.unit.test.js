// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<Transitions /> - index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "default",
      "fetchTransitions",
      "getTransitionById",
      "reducer",
      "selectTransitions",
      "selectTransitionByTypeAndStatus"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
