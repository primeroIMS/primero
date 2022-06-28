import { CUSTOM_STRINGS_SOURCE } from "../constants";

import isFieldRequired from "./is-field-required";

describe("isFieldRequired", () => {
  it("returns true when online and options uses endpoint", () => {
    expect(isFieldRequired(true, CUSTOM_STRINGS_SOURCE.agency, true)).to.be.true;
  });

  it("returns false when not online and options uses endpoint", () => {
    expect(isFieldRequired(false, CUSTOM_STRINGS_SOURCE.agency, true)).to.be.false;
  });

  it("returns true when online and options does not use endpoint", () => {
    expect(isFieldRequired(true, "none-api-option-source", true)).to.be.true;
  });

  it("returns true when offline and options does not use endpoint and required true", () => {
    expect(isFieldRequired(false, "none-api-option-source", true)).to.be.true;
  });

  it("returns false when offline and options does not use endpoint and required false", () => {
    expect(isFieldRequired(false, "none-api-option-source", false)).to.be.false;
  });
});
