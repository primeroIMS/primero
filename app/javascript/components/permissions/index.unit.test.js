import * as index from "./index";

describe("Permissions - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "default",
      "ASSIGN",
      "ACTIONS",
      "MANAGE",
      "RESOURCES",
      "RECORD_RESOURCES",
      "ADMIN_ACTIONS",
      "ADMIN_RESOURCES",
      "CREATE_REPORTS",
      "READ_REPORTS",
      "EXPORT_CUSTOM",
      "CREATE_RECORDS",
      "WRITE_RECORDS",
      "READ_RECORDS",
      "ENABLE_DISABLE_RECORD",
      "FLAG_RECORDS",
      "ADD_NOTE",
      "DISPLAY_VIEW_PAGE",
      "SHOW_TASKS",
      "ADD_INCIDENT",
      "CREATE_INCIDENT",
      "ADD_SERVICE",
      "SHOW_AUDIT_LOGS",
      "REFER_FROM_SERVICE",
      "REQUEST_APPROVAL",
      "APPROVAL",
      "SHOW_EXPORTS",
      "SHOW_APPROVALS",
      "DASH_APPROVALS_PENDING",
      "DASH_APPROVALS",
      "GROUP_PERMISSIONS",
      "SHOW_CHANGE_LOG"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
