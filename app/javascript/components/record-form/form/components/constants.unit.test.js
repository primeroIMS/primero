import { expect } from "chai";

import * as componentsConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...componentsConstants };

    ["GUIDING_QUESTIONS_NAME", "WORKFLOW_INDICATOR_NAME"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.deep.equal({});
  });
});
