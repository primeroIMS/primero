import { expect } from "chai";

import actions from "./actions";

describe("<TransferApproval /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "APPROVE_TRANSFER",
      "APPROVE_TRANSFER_STARTED",
      "APPROVE_TRANSFER_SUCCESS",
      "APPROVE_TRANSFER_FINISHED",
      "APPROVE_TRANSFER_FAILURE"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
