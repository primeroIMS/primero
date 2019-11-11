import { expect } from "chai";

import * as transitionsConstants from "./constants";

describe("<Transitions /> - Constants - RecordActions", () => {
  it("should have known constant", () => {
    const constants = { ...transitionsConstants };

    ["TRANSFER_ACTIONS_NAME", "REFERRAL_ACTIONS_NAME"].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
