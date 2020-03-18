import { expect } from "../../../../test/unit-test-helpers";

import * as constants from "./constants";

describe("<RolesList /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    expect(clonedActions).to.be.an("object");
    ["LIST_HEADERS", "NAME"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
