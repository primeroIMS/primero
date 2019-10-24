import { expect } from "chai";

import * as Actions from "./actions";

describe("filters-builder - Actions", () => {
  it("should have known actions", () => {
    const actions = { ...Actions };

    expect(actions).to.have.property("FETCH_TRANSITIONS");
    expect(actions).to.have.property("FETCH_TRANSITIONS_SUCCESS");

    delete actions.FETCH_TRANSITIONS;
    delete actions.FETCH_TRANSITIONS_SUCCESS;

    expect(actions).to.deep.equal({});
  });
});