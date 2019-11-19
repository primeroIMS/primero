import { expect } from "chai";
import { List } from "immutable";

import * as PERMISSIONS from "./permissions";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const permissions = { ...PERMISSIONS.ACTIONS };

    [
      "MANAGE",
      "ASSIGN",
      "ASSIGN_WITHIN_USER_GROUP",
      "ASSIGN_WITHIN_AGENCY_PERMISSIONS",
      "REOPEN",
      "CLOSE",
      "ENABLE_DISABLE_RECORD",
      "ADD_NOTE",
      "READ",
      "REFERRAL",
      "TRANSFER",
      "DISPLAY_VIEW_PAGE",
      "SEARCH_OWNED_BY_OTHERS",
      "DASH_TASKS",
      "GROUP_READ",
      "CREATE",
      "WRITE",
      "EXPORT_LIST_VIEW",
      "EXPORT_CSV",
      "EXPORT_EXCEL",
      "EXPORT_JSON",
      "EXPORT_PHOTO_WALL",
      "EXPORT_PDF",
      "EXPORT_UNHCR",
      "EXPORT_DUPLICATE_ID",
      "EXPORT_CASE_PDF",
      "EXPORT_MRM_VIOLATION_XLS",
      "EXPORT_INCIDENT_RECORDER",
      "EXPORT_CUSTOM",
      "FLAG"
    ].forEach(property => {
      expect(permissions).to.have.property(property);
      expect(permissions[property]).to.be.a("string");
      delete permissions[property];
    });
    expect(permissions).to.be.empty;
  });
  describe("checkPermissions", () => {
    it("should send true because current permission it's allowed", () => {
      const currentPermissions = List(["refer"]);
      const allowedPermissions = ["refer"];

      expect(
        PERMISSIONS.checkPermissions(currentPermissions, allowedPermissions)
      ).to.be.true;
    });
    it("should send false because current permission is not allowed", () => {
      const currentPermissions = List(["manage"]);
      const allowedPermissions = ["read"];

      expect(
        PERMISSIONS.checkPermissions(currentPermissions, allowedPermissions)
      ).to.be.false;
    });
  });

  it("should have known RESOURCES", () => {
    const resources = { ...PERMISSIONS.RESOURCES };

    [
      "cases",
      "dashboards",
      "incidents",
      "potential_matches",
      "reports",
      "tracing_requests"
    ].forEach(property => {
      expect(resources).to.have.property(property);
      expect(resources[property]).to.be.a("string");
      delete resources[property];
    });
    expect(resources).to.be.empty;
  });

  it("should have CREATE_REPORTS", () => {
    const permissions = [...PERMISSIONS.CREATE_REPORTS];

    expect(permissions).to.be.a("array");
    ["create", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have READ_REPORTS", () => {
    const permissions = [...PERMISSIONS.READ_REPORTS];

    expect(permissions).to.be.a("array");
    ["create", "group_read", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have EXPORT_CUSTOM", () => {
    const permissions = [...PERMISSIONS.EXPORT_CUSTOM];

    expect(permissions).to.be.a("array");
    ["create", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have CREATE_RECORDS", () => {
    const permissions = [...PERMISSIONS.CREATE_RECORDS];

    expect(permissions).to.be.a("array");
    ["create", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have WRITE_RECORDS", () => {
    const permissions = [...PERMISSIONS.WRITE_RECORDS];

    expect(permissions).to.be.a("array");
    ["write", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have READ_RECORDS", () => {
    const permissions = [...PERMISSIONS.READ_RECORDS];

    expect(permissions).to.be.a("array");
    ["write", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have ENABLE_DISABLE_RECORD", () => {
    const permissions = [...PERMISSIONS.ENABLE_DISABLE_RECORD];

    expect(permissions).to.be.a("array");
    ["enable_disable_record", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have FLAG_RECORDS", () => {
    const permissions = [...PERMISSIONS.FLAG_RECORDS];

    expect(permissions).to.be.a("array");
    ["flag", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have ADD_NOTE", () => {
    const permissions = [...PERMISSIONS.ADD_NOTE];

    expect(permissions).to.be.a("array");
    ["add_note", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have DISPLAY_VIEW_PAGE", () => {
    const permissions = [...PERMISSIONS.DISPLAY_VIEW_PAGE];

    expect(permissions).to.be.a("array");
    ["display_view_page", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have SHOW_TASKS", () => {
    const permissions = [...PERMISSIONS.SHOW_TASKS];

    expect(permissions).to.be.a("array");
    ["dash_tasks", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have SHOW_EXPORTS", () => {
    const permissions = [...PERMISSIONS.SHOW_EXPORTS];

    expect(permissions).to.be.a("array");
    [
      "export_case_pdf",
      "export_csv",
      "export_custom",
      "export_duplicate_id_csv",
      "export_xls",
      "export_incident_recorder_xls",
      "export_json",
      "export_list_view_csv",
      "export_mrm_violation_xls",
      "export_pdf",
      "export_photowall",
      "export_unhcr_csv",
      "manage"
    ].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });
});
