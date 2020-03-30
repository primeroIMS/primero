import { expect } from "chai";

import * as referralConstants from "./constants";

describe("<Referral /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...referralConstants };

    [
      "NAME",
      "REFERRAL_FIELD",
      "REMOTE_SYSTEM_FIELD",
      "SERVICE_FIELD",
      "AGENCY_FIELD",
      "LOCATION_FIELD",
      "TRANSITIONED_TO_FIELD",
      "NOTES_FIELD",
      "SERVICE_RECORD_FIELD",
      "MAIN_FORM"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
