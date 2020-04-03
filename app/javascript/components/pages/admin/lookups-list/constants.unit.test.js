import { expect } from "../../../../test";

import * as constants from "./constants";

describe("<LookupsList /> pages/admin/lookups-list", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    expect(clone).to.be.an("object");

    ["NAME", "TABLE_OPTIONS"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
