import { expect } from "chai";

import * as transitionsConstants from "./constants";

describe("<Transitions /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...transitionsConstants };

    [
      "REFERRAL_SUMMARY_NAME",
      "REFERRAL_DETAILS_NAME",
      "TRANSITIONS_NAME"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
