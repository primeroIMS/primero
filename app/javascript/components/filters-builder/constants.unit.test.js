import { expect } from "chai";

import * as filterBuilderConstants from "./constants";

describe("<FiltersBuilder /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...filterBuilderConstants };

    ["COLOR_PRIMARY", "VARIANT_BUTTON_TYPES"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
