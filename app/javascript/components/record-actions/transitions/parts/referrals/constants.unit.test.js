import { expect } from "chai";

import * as referralConstants from "./constants";

describe("<Referral /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...referralConstants };

    expect(constants).to.have.property("NAME");
    expect(constants.NAME).to.be.a("string");
    delete constants.NAME;

    expect(constants).to.be.empty;
  });
});
