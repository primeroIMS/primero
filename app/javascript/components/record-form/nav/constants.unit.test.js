import { expect } from "chai";

import * as navConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...navConstants };

    ["NAME", "RECORD_INFORMATION", "NAV_GROUP", "NAV_ITEM"].forEach(
      property => {
        expect(constants).to.have.property(property);
        delete constants[property];
      }
    );

    expect(constants).to.deep.equal({});
  });
});
