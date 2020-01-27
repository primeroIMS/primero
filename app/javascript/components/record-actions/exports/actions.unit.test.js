import { expect } from "../../../test";

import actions from "./actions";

describe("<RecordActions /> - exports/actions", () => {
  const clone = { ...actions };

  it("should have known actions", () => {
    expect(clone).to.be.an("object");
    ["EXPORT"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
