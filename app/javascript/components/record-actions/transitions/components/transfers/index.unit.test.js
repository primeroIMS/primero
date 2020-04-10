import clone from "lodash/clone";

import * as index from "./index";

describe("<TransferForm /> - index", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");

    ["default"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.deep.equal({});
  });
});
