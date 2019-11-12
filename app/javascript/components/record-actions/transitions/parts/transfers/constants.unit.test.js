import { expect } from "chai";

import * as transferConstants from "./constants";

describe("<Transfer /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...transferConstants };

    expect(constants).to.have.property("NAME");
    expect(constants.NAME).to.be.a("string");
    delete constants.NAME;

    expect(constants).to.be.empty;
  });
});
