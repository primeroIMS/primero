import { expect } from "chai";

import * as namespace from "./namespace";

describe("Approvals - namespace", () => {
  const namespaceValues = { ...namespace };

  it("should have known properties", () => {
    expect(namespaceValues).to.be.an("object");
  });
});
