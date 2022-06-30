import { CUSTOM_STRINGS_SOURCE } from "../constants";

import asyncFieldOffline from "./async-field-offline";

describe("asyncFieldOffline", () => {
  it("returns false when online and options uses endpoint", () => {
    expect(asyncFieldOffline(true, CUSTOM_STRINGS_SOURCE.agency)).to.be.false;
  });

  it("returns true when not online and options uses endpoint", () => {
    expect(asyncFieldOffline(false, CUSTOM_STRINGS_SOURCE.agency)).to.be.true;
  });

  it("returns false when online and options does not use endpoint", () => {
    expect(asyncFieldOffline(true, "none-api-option-source")).to.be.false;
  });

  it("returns false when offline and options does not use endpoint and required true", () => {
    expect(asyncFieldOffline(false, "none-api-option-source")).to.be.false;
  });
});
