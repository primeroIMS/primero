import { expect } from "chai";

import * as index from "./index";

describe("<DisplayData /> - Index", () => {
  it("should have known constant", () => {
    const indexValues = { ...index };

    expect(indexValues).to.be.an("object");
    ["default"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
