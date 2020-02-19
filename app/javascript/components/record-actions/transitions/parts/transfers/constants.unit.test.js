import { expect } from "chai";

import * as transferConstants from "./constants";

describe("<Transfer /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...transferConstants };

    [
      "NAME",
      "TRANSFER_FIELD",
      "REMOTE_SYSTEM_FIELD",
      "CONSENT_INDIVIDUAL_FIELD",
      "AGENCY_FIELD",
      "LOCATION_FIELD",
      "TRANSITIONED_TO_FIELD",
      "NOTES_FIELD"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
