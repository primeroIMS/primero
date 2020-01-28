import { expect } from "../../test";

import * as namespace from "./namespace";

describe("Approvals - namespace", () => {
  const namespaceValues = { ...namespace };

  it("should have known properties", () => {
    expect(namespaceValues).to.be.an("object");
  });
});
