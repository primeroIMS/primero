import { expect } from "chai";

import * as approvalsConstants from "./constants";

describe("<Approvals /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...approvalsConstants };

    [
      "CASE_PLAN",
      "NAME",
      "NAME_DETAIL",
      "NAME_PANEL",
      "NAME_SUMMARY",
      "STATUS_APPROVED",
      "STATUS_REJECTED"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });
    expect(constants).to.be.empty;
  });
});
