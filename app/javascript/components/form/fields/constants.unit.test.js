import { expect } from "../../../test";

import * as constants from "./constants";

describe("<Form />/fields - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["ERROR_FIELD_NAME"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
