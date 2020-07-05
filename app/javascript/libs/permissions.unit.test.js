import { List } from "immutable";

import * as PERMISSIONS from "./permissions";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const permissions = { ...PERMISSIONS.ACTIONS };

    [
      "ADD_NOTE",
      "APPROVE_ASSESSMENT",
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
      "DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT",
      "DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN",
      "DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS",
      "DASH_CASES_BY_TASK_OVERDUE_SERVICES",
      "DASH_CASE_OVERVIEW",
      "DASH_CASE_RISK",
      "DASH_GROUP_OVERVIEW",
      "DASH_PROTECTION_CONCERNS",
      "DASH_REPORTING_LOCATION",
      "DASH_SHARED_FROM_MY_TEAM",
      "DASH_SHARED_WITH_ME",
      "DASH_SHARED_WITH_MY_TEAM",
      "DASH_SHARED_WITH_OTHERS",
      "DASH_TASKS",
      "DASH_WORKFLOW",
      "DASH_WORKFLOW_TEAM",
      "DELETE",
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
      "RECEIVE_REFERRAL",
      "RECEIVE_TRANSFER",
      "REFERRAL",
      "REFERRAL_FROM_SERVICE",
      "REMOVE_ASSIGNED_USERS",
      "REOPEN",
      "REQUEST_APPROVAL_ASSESSMENT",
      "REQUEST_APPROVAL_CASE_PLAN",
      "REQUEST_APPROVAL_CLOSURE",
      "SEARCH_OWNED_BY_OTHERS",
      "SERVICES_SECTION_FROM_CASE",
      "TRANSFER",
      "WRITE"
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
      "agencies",
      "audit_logs",
      "cases",
      "contact_information",
      "dashboards",
      "incidents",
      "lookups",
      "metadata",
      "potential_matches",
      "reports",
      "roles",
      "forms",
      "systems",
      "tracing_requests",
      "user_groups",
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

  it("should have GROUP_PERMISSIONS", () => {
    const groupPermissions = { ...PERMISSIONS.GROUP_PERMISSIONS };

    ["AGENCY", "ALL", "GROUP", "SELF"].forEach(property => {
      expect(groupPermissions).to.have.property(property);
      expect(groupPermissions[property]).to.be.a("string");
      delete groupPermissions[property];
    });
    expect(groupPermissions).to.be.empty;
  });

  it("should have REQUEST_APPROVAL", () => {
    const permissions = [...PERMISSIONS.REQUEST_APPROVAL];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.MANAGE,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_ASSESSMENT,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CLOSURE
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have APPROVAL", () => {
    const permissions = [...PERMISSIONS.APPROVAL];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.APPROVE_ASSESSMENT,
      PERMISSIONS.ACTIONS.APPROVE_CASE_PLAN,
      PERMISSIONS.ACTIONS.APPROVE_CLOSURE,
      PERMISSIONS.ACTIONS.MANAGE
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });

  it("should have SHOW_APPROVALS", () => {
    const permissions = [...PERMISSIONS.SHOW_APPROVALS];

    expect(permissions).to.be.a("array");
    [
      PERMISSIONS.ACTIONS.APPROVE_ASSESSMENT,
      PERMISSIONS.ACTIONS.APPROVE_CASE_PLAN,
      PERMISSIONS.ACTIONS.APPROVE_CLOSURE,
      PERMISSIONS.ACTIONS.MANAGE,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_ASSESSMENT,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CLOSURE
    ].forEach(element => {
      expect(permissions).to.include(element);
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(permissions).to.be.empty;
  });
});
