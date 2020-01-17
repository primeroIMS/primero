import { expect } from "chai";

import * as constants from "./constants";

describe("<IndexFilters> - Components - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    expect(clone).to.have.property("NAME");
    expect(clone.NAME).to.be.an("string");
    delete clone.NAME;

    expect(clone).to.be.empty;
  });
});
