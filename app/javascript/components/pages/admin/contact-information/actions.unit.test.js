import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";

describe("<ContactInformation /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "SAVE_CONTACT_INFORMATION",
      "SAVE_CONTACT_INFORMATION_STARTED",
      "SAVE_CONTACT_INFORMATION_FINISHED",
      "SAVE_CONTACT_INFORMATION_SUCCESS",
      "SAVE_CONTACT_INFORMATION_FAILURE"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
