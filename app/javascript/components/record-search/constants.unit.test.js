import { expect } from "chai";

import * as recordSearch from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...recordSearch };

    expect(constants).to.have.property("NAME");
    expect(constants.NAME).to.be.an("string");
    delete constants.NAME;

    expect(constants).to.deep.equal({});
  });
});
