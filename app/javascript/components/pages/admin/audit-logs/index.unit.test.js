import * as index from "./index";

describe("<AuditLogs /> - pages/admin/audit-logs/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["default", "reducer"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
