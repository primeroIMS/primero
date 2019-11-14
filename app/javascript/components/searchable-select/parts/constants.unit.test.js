import { expect } from "chai";

import * as constantsParts from "./constants";

describe("<SearchableSelect /> - Parts - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...constantsParts };

    expect(constants).to.have.property("CUSTOM_AUTOCOMPLETE_NAME");
    expect(constants.CUSTOM_AUTOCOMPLETE_NAME).to.be.a("string");
    delete constants.CUSTOM_AUTOCOMPLETE_NAME;

    expect(constants).to.be.empty;
  });
});
