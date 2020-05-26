import clone from "lodash/clone";

import actions from "./actions";

describe("bulk-transitons - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone({ ...actions });

    [
      "BULK_ASSIGN",
      "BULK_ASSIGN_USER_SAVE",
      "BULK_ASSIGN_USER_SAVE_SUCCESS",
      "BULK_ASSIGN_USER_SAVE_STARTED",
      "BULK_ASSIGN_USER_SAVE_FAILURE",
      "BULK_ASSIGN_USER_SAVE_FINISHED",
      "CLEAR_BULK_ASSIGN_MESSAGES"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
