import * as constants from "./constants";

describe("<Transitions /> - Constants - RecordActions", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    expect(clonedConstants, "DEPRECATED TRANSFER_ACTIONS_NAME").to.not.have.property("TRANSFER_ACTIONS_NAME");
    expect(clonedConstants, "DEPRECATED REFERRAL_ACTIONS_NAME").to.not.have.property("REFERRAL_ACTIONS_NAME");

    ["NAME", "REFERRAL_TYPE", "REFERRAL_FORM_ID", "TRANSFER_FORM_ID"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
