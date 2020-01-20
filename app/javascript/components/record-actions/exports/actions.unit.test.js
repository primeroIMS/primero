import { expect } from "chai";

import actions from "./actions";

describe("<RecordActions /> - exports/actions", () => {
  it("should have known actions", () => {
    const clone = { ...actions };

    expect(clone).to.have.property("EXPORT");

    delete clone.EXPORT;

    expect(clone).to.deep.equal({});
  });
});
