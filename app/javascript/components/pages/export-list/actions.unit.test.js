import { expect } from "../../../test";

import actions from "./actions";

describe("<ExportList /> - pages/export-list/actions", () => {
  it("should have known actions", () => {
    const clone = { ...actions };

    [
      "FETCH_EXPORTS",
      "FETCH_EXPORTS_STARTED",
      "FETCH_EXPORTS_SUCCESS",
      "FETCH_EXPORTS_FINISHED",
      "FETCH_EXPORTS_FAILURE"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
