import { expect } from "../../../../test/unit-test-helpers";

import * as constants from "./constants";

describe("<AuditLogs /> pages/admin/audit-logs", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    expect(clonedActions).to.be.an("object");
    ["NAME"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
