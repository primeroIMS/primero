// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./index";

describe("<SubformDialogFields /> - index", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["default"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
    expect(clone).to.be.empty;
  });
});
