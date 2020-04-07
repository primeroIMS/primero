import { expect } from "../../../../test";

import * as constants from "./constants";

describe("<RolesForm /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    [
      "ACTION_BUTTONS_NAME",
      "FIELD_NAMES",
      "FORM_CHECK_ERRORS",
      "NAME"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
