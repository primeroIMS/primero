import { expect } from "../../test";

import * as constants from "./constants";

describe("<Application /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["PERMISSIONS", "RESOURCES", "RESOURCE_ACTIONS"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
