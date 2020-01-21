import { expect } from "chai";

import * as index from "./index";

describe("Approvals - Panel - index", () => {
  const indexValues = { ...index };

  it("should have known exported properties", () => {
    ["ApprovalPanel"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
