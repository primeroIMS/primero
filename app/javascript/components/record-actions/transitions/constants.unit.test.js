import * as transitionsConstants from "./constants";

describe("<Transitions /> - Constants - RecordActions", () => {
  it("should have known constant", () => {
    const constants = { ...transitionsConstants };

    expect(constants, "DEPRECATED TRANSFER_ACTIONS_NAME").to.not.have.property("TRANSFER_ACTIONS_NAME");
    expect(constants, "DEPRECATED REFERRAL_ACTIONS_NAME").to.not.have.property("REFERRAL_ACTIONS_NAME");
    expect(constants).to.have.property("NAME", "REFERRAL_TYPE", "REFERRAL_FORM_ID");

    delete constants.NAME;
    delete constants.REFERRAL_TYPE;
    delete constants.REFERRAL_FORM_ID;

    expect(constants).to.be.empty;
  });
});
