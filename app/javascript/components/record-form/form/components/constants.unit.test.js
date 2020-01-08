import { expect } from "chai";

import * as componentsConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...componentsConstants };

    expect(constants).to.have.property("GUIDING_QUESTIONS_NAME");
    expect(constants).to.have.property("WORKFLOW_INDICATOR_NAME");

    delete constants.GUIDING_QUESTIONS_NAME;
    delete constants.WORKFLOW_INDICATOR_NAME;

    expect(constants).to.deep.equal({});
  });
});
