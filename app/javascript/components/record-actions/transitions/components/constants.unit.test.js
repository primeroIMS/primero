import { expect } from "chai";

import * as constants from "./constants";

describe("<Transitions /> - record-actions/transitions/components/constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["REASSIGN_FORM_NAME"].forEach(property => {
      expect(clone).to.have.property(property);
      expect(clone[property]).to.be.a("string");
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
