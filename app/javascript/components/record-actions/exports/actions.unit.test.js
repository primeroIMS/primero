// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<RecordActions /> - exports/actions", () => {
  const clone = { ...actions };

  it("should have known actions", () => {
    expect(clone).to.be.an("object");
    ["EXPORT"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
