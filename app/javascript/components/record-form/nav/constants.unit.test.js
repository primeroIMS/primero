import { expect } from "chai";

import * as navConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...navConstants };

    expect(constants).to.have.property("NAME");
    expect(constants).to.have.property("RECORD_INFORMATION");
    expect(constants).to.have.property("NAV_GROUP");
    expect(constants).to.have.property("NAV_ITEM");

    delete constants.NAME;
    delete constants.RECORD_INFORMATION;
    delete constants.NAV_GROUP;
    delete constants.NAV_ITEM;

    expect(constants).to.deep.equal({});
  });
});
