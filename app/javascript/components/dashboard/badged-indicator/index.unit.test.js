import { expect } from "chai";

import * as index from "./index";

describe("<BadgedIndicator /> - Index", () => {
  it("should have known constant", () => {
    const indexValues = { ...index };

    expect(indexValues).to.be.an("object");
    ["BadgedIndicator"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
