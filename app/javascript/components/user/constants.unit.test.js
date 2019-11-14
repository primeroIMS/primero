import { expect } from "chai";

import * as permissionsConstans from "./constants";

describe("Verifying user constant", () => {
  it("should have known constant", () => {
    const constants = { ...permissionsConstans };

    expect(constants.PERMISSIONS).to.be.an("string");
    delete constants.PERMISSIONS;
    expect(constants).to.deep.equal({});
  });
});
