import { List } from "immutable";

import { expect } from "../test";

import * as PERMISSIONS from "./permissions";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const permissions = { ...PERMISSIONS.ACTIONS };

    [
      "ADD_NOTE",
      "APPROVE_BIA",
      "APPROVE_CASE_PLAN",
      "APPROVE_CLOSURE",
      "ASSIGN",
      "ASSIGN_WITHIN_AGENCY_PERMISSIONS",
      "ASSIGN_WITHIN_USER_GROUP",
      "CLOSE",
      "CREATE",
      "DASH_APPROVALS_ASSESSMENT",
      "DASH_APPROVALS_ASSESSMENT_PENDING",
      "DASH_APPROVALS_CASE_PLAN",
      "DASH_APPROVALS_CASE_PLAN_PENDING",
      "DASH_APPROVALS_CLOSURE",
      "DASH_APPROVALS_CLOSURE_PENDING",
      "DASH_CASE_RISK",
      "DASH_REPORTING_LOCATION",
      "DASH_TASKS",
      "DASH_WORKFLOW",
      "DASH_WORKFLOW_TEAM",
      "DISPLAY_VIEW_PAGE",
      "ENABLE_DISABLE_RECORD",
      "EXPORT_CASE_PDF",
      "EXPORT_CSV",
      "EXPORT_CUSTOM",
      "EXPORT_DUPLICATE_ID",
      "EXPORT_EXCEL",
      "EXPORT_INCIDENT_RECORDER",
      "EXPORT_JSON",
      "EXPORT_LIST_VIEW",
      "EXPORT_MRM_VIOLATION_XLS",
      "EXPORT_PDF",
      "EXPORT_PHOTO_WALL",
      "EXPORT_UNHCR",
      "FLAG",
      "GROUP_READ",
      "INCIDENT_DETAILS_FROM_CASE",
      "MANAGE",
      "READ",
      "REFERRAL",
      "REOPEN",
      "REQUEST_APPROVAL_BIA",
      "REQUEST_APPROVAL_CASE_PLAN",
      "REQUEST_APPROVAL_CLOSURE",
      "SEARCH_OWNED_BY_OTHERS",
      "SERVICES_SECTION_FROM_CASE",
      "TRANSFER",
      "WRITE",
      "APPROVE_BIA",
      "APPROVE_CASE_PLAN",
      "APPROVE_CLOSURE"
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
      "tracing_requests",
      "users"
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
    [PERMISSIONS.ACTIONS.CREATE, PERMISSIONS.ACTIONS.MANAGE].forEach(
      element => {
        expect(permissions).to.include(element);
        permissions.splice(permissions.indexOf(element), 1);
      }
    );
    expect(permissions).to.be.empty;
  });

  it("should have READ_REPORTS", () => {
    const permissions = [...PERMISSIONS.READ_REPORTS];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.READ,
      PERMISSIONS.ACTIONS.GROUP_READ,
      PERMISSIONS.ACTIONS.MANAGE
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have EXPORT_CUSTOM", () => {
    const permissions = [...PERMISSIONS.EXPORT_CUSTOM];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.EXPORT_CUSTOM, PERMISSIONS.ACTIONS.MANAGE].forEach(
      element => {
        expect(permissions).to.include(element);
        permissions.splice(permissions.indexOf(element), 1);
      }
    );
    expect(permissions).to.be.empty;
  });

  it("should have CREATE_RECORDS", () => {
    const permissions = [...PERMISSIONS.CREATE_RECORDS];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.CREATE, PERMISSIONS.ACTIONS.MANAGE].forEach(
      element => {
        expect(permissions).to.include(element);
        permissions.splice(permissions.indexOf(element), 1);
      }
    );

    expect(permissions).to.be.empty;
  });

  it("should have WRITE_RECORDS", () => {
    const permissions = [...PERMISSIONS.WRITE_RECORDS];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.MANAGE, PERMISSIONS.ACTIONS.WRITE].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have READ_RECORDS", () => {
    const permissions = [...PERMISSIONS.READ_RECORDS];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.MANAGE, PERMISSIONS.ACTIONS.READ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have ENABLE_DISABLE_RECORD", () => {
    const permissions = [...PERMISSIONS.ENABLE_DISABLE_RECORD];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.ENABLE_DISABLE_RECORD,
      PERMISSIONS.ACTIONS.MANAGE
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have FLAG_RECORDS", () => {
    const permissions = [...PERMISSIONS.FLAG_RECORDS];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.FLAG, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have ADD_NOTE", () => {
    const permissions = [...PERMISSIONS.ADD_NOTE];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.ADD_NOTE, PERMISSIONS.ACTIONS.MANAGE].forEach(
      element => {
        expect(permissions).to.include(element);
        permissions.splice(permissions.indexOf(element), 1);
      }
    );
    expect(permissions).to.be.empty;
  });

  it("should have DISPLAY_VIEW_PAGE", () => {
    const permissions = [...PERMISSIONS.DISPLAY_VIEW_PAGE];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.DISPLAY_VIEW_PAGE, PERMISSIONS.ACTIONS.MANAGE].forEach(
      element => {
        expect(permissions).to.include(element);
        permissions.splice(permissions.indexOf(element), 1);
      }
    );
    expect(permissions).to.be.empty;
  });

  it("should have SHOW_TASKS", () => {
    const permissions = [...PERMISSIONS.SHOW_TASKS];

    expect(permissions).to.be.a("array");
    [PERMISSIONS.ACTIONS.DASH_TASKS, PERMISSIONS.ACTIONS.MANAGE].forEach(
      element => {
        expect(permissions).to.include(element);
        permissions.splice(permissions.indexOf(element), 1);
      }
    );
    expect(permissions).to.be.empty;
  });

  it("should have SHOW_EXPORTS", () => {
    const permissions = [...PERMISSIONS.SHOW_EXPORTS];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.EXPORT_CASE_PDF,
      PERMISSIONS.ACTIONS.EXPORT_CSV,
      PERMISSIONS.ACTIONS.EXPORT_CUSTOM,
      PERMISSIONS.ACTIONS.EXPORT_DUPLICATE_ID,
      PERMISSIONS.ACTIONS.EXPORT_EXCEL,
      PERMISSIONS.ACTIONS.EXPORT_INCIDENT_RECORDER,
      PERMISSIONS.ACTIONS.EXPORT_JSON,
      PERMISSIONS.ACTIONS.EXPORT_LIST_VIEW,
      PERMISSIONS.ACTIONS.EXPORT_MRM_VIOLATION_XLS,
      PERMISSIONS.ACTIONS.EXPORT_PDF,
      PERMISSIONS.ACTIONS.EXPORT_PHOTO_WALL,
      PERMISSIONS.ACTIONS.EXPORT_UNHCR,
      PERMISSIONS.ACTIONS.MANAGE
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have DASH_APPROVALS_PENDING", () => {
    const permissions = [...PERMISSIONS.DASH_APPROVALS_PENDING];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ASSESSMENT_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CASE_PLAN_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CLOSURE_PENDING
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have DASH_APPROVALS", () => {
    const permissions = [...PERMISSIONS.DASH_APPROVALS];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ASSESSMENT_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CASE_PLAN_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CLOSURE_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ASSESSMENT,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CASE_PLAN,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CLOSURE
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });
});
