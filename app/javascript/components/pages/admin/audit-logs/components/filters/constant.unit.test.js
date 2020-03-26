import { expect } from "../../../../../../test";

import * as constants from "./constants";

describe("<AuditLogs /> pages/admin/audit-logs/components/filters/constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(clone).to.be.an("object");
    ["NAME", "USER_NAME", "TIMESTAMP"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
