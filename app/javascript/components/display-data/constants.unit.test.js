import { expect } from "chai";

import * as displayDataConstants from "./constants";

describe("<DisplayData /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...displayDataConstants };

    ["NAME"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
