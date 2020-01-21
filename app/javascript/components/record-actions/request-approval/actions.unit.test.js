import { expect } from "chai";

import * as actions from "./actions";

describe("<RequestApproval /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "APPROVE_RECORD",
      "APPROVE_RECORD_STARTED",
      "APPROVE_RECORD_SUCCESS",
      "APPROVE_RECORD_FINISHED",
      "APPROVE_RECORD_FAILURE"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});