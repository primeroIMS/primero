import { expect } from "chai";

import * as permissionsConstants from "./constants";

describe("Verifying user constant", () => {
  it("should have known constant", () => {
    const constants = { ...permissionsConstants };

    expect(constants.PERMISSIONS).to.be.an("string");
    delete constants.PERMISSIONS;
    expect(constants).to.deep.equal({});
  });
});
