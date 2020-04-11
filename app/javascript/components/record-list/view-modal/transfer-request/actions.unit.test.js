import actions from "./actions";

describe("<TransferRequest /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "TRANSFER_REQUEST",
      "TRANSFER_REQUEST_SUCCESS",
      "TRANSFER_REQUEST_STARTED",
      "TRANSFER_REQUEST_FAILURE",
      "TRANSFER_REQUEST_URL"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
