import { expect } from "chai";

import * as subformConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...subformConstants };

    ["LOOKUP_HEADER_NAME", "DATE_HEADER_NAME"].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
