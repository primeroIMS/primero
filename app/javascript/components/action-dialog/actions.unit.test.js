// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actions from "./actions";

describe("<RecordActions /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    ["SET_DIALOG", "SET_DIALOG_PENDING", "CLEAR_DIALOG"].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
