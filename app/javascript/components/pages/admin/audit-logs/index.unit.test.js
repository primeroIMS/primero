import { expect } from "../../../../test";

import * as index from "./index";

describe("<AuditLogs /> - pages/admin/audit-logs/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["AuditLogs", "reducers"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
