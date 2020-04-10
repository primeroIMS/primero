import * as index from "./index";

describe("<Transitions /> - components/index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");

    [
      "TransferForm",
      "TransitionDialog",
      "ReferralForm",
      "ReassignForm",
      "generatePath"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
