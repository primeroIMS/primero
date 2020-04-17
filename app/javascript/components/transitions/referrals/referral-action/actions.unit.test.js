import actions from "./actions";

describe("<ReferralAction /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "REFERRAL_DONE",
      "REFERRAL_DONE_STARTED",
      "REFERRAL_DONE_SUCCESS",
      "REFERRAL_DONE_FINISHED",
      "REFERRAL_DONE_FAILURE"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
