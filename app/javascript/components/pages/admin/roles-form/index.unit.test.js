import { expect } from "chai";

import * as index from "./index";

describe("pages/admin/<RolesForm> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    ["default", "reducers"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
