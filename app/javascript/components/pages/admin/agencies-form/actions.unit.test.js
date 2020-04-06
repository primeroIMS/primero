import { expect } from "../../../../test";

import actions from "./actions";

describe("<AgenciesForm /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "CLEAR_SELECTED_AGENCY",
      "FETCH_AGENCY",
      "FETCH_AGENCY_STARTED",
      "FETCH_AGENCY_SUCCESS",
      "FETCH_AGENCY_FINISHED",
      "FETCH_AGENCY_FAILURE",
      "SAVE_AGENCY",
      "SAVE_AGENCY_STARTED",
      "SAVE_AGENCY_FINISHED",
      "SAVE_AGENCY_SUCCESS",
      "SAVE_AGENCY_FAILURE"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
