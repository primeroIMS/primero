import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";

describe("<AgenciesList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "AGENCIES",
      "AGENCIES_STARTED",
      "AGENCIES_SUCCESS",
      "AGENCIES_FAILURE",
      "AGENCIES_FINISHED"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
