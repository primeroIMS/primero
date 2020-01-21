import { expect } from "chai";

import * as index from "./index";

describe("Approvals - Summary - index", () => {
  const indexValues = { ...index };

  it("should have known exported properties", () => {
    ["ApprovalSummary"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
