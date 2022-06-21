import { CUSTOM_STRINGS_SOURCE } from "../constants";

import apiSelectOffline from "./api-select-offline";

describe("apiSelectOffline", () => {
  it("returns false when online options uses endpoint", () => {
    expect(apiSelectOffline(true, CUSTOM_STRINGS_SOURCE.agency)).to.be.false;
  });

  it("returns true when not online options uses endpoint", () => {
    expect(apiSelectOffline(false, CUSTOM_STRINGS_SOURCE.agency)).to.be.true;
  });

  it("returns true when online options does not use endpoint", () => {
    expect(apiSelectOffline(true, "none-api-option-source")).to.be.false;
  });

  it("returns true when online options does not use endpoint", () => {
    expect(apiSelectOffline(false, "none-api-option-source")).to.be.false;
  });
});
