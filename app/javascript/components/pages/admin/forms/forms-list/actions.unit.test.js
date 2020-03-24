import { expect } from "../../../../../test/unit-test-helpers";

import actions from "./actions";

describe("<FormsList /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "RECORD_FORMS",
      "RECORD_FORMS_STARTED",
      "RECORD_FORMS_SUCCESS",
      "RECORD_FORMS_FINISHED",
      "RECORD_FORMS_FAILURE"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
