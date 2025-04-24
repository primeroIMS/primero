// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as PERMISSIONS from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const permissions = { ...PERMISSIONS.ACTIONS };

    [
      "ADD_NOTE",
      "ADD_REGISTRY_RECORD",
      "AGENCY_READ",
      "APPROVE_ACTION_PLAN",
      "APPROVE_ASSESSMENT",
      "APPROVE_CASE_PLAN",
      "APPROVE_CLOSURE",
      "APPROVE_GBV_CLOSURE",
      "ASSIGN_WITHIN_AGENCY_PERMISSIONS",
      "ASSIGN_WITHIN_AGENCY",
      "ASSIGN_WITHIN_USER_GROUP",
      "ASSIGN",
      "CASE_FROM_FAMILY",
      "CHANGE_LOG",
      "CLOSE",
      "CONSENT_OVERRIDE",
      "COPY",
      "CREATE",
      "DASH_APPROVALS_ACTION_PLAN_PENDING",
      "DASH_APPROVALS_ACTION_PLAN",
      "DASH_APPROVALS_ASSESSMENT_PENDING",
      "DASH_APPROVALS_ASSESSMENT",
      "DASH_APPROVALS_CASE_PLAN_PENDING",
      "DASH_APPROVALS_CASE_PLAN",
      "DASH_APPROVALS_CLOSURE_PENDING",
      "DASH_APPROVALS_CLOSURE",
      "DASH_APPROVALS_GBV_CLOSURE_PENDING",
      "DASH_APPROVALS_GBV_CLOSURE",
      "DASH_CASE_INCIDENT_OVERVIEW",
      "DASH_CASE_OVERVIEW",
      "DASH_ACTION_NEEDED_NEW_UPDATED",
      "DASH_ACTION_NEEDED_NEW_REFERRALS",
      "DASH_ACTION_NEEDED_TRANSFER_AWAITING_ACCEPTANCE",
      "DASH_CASE_RISK",
      "DASH_CASES_BY_SOCIAL_WORKER",
      "DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT",
      "DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN",
      "DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS",
      "DASH_CASES_BY_TASK_OVERDUE_SERVICES",
      "DASH_CASES_TO_ASSIGN",
      "DASH_FLAGS",
      "DASH_GROUP_OVERVIEW",
      "DASH_NATIONAL_ADMIN_SUMMARY",
      "DASH_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES",
      "DASH_PROTECTION_CONCERNS",
      "DASH_REPORTING_LOCATION",
      "DASH_SHARED_FROM_MY_TEAM",
      "DASH_SHARED_WITH_ME",
      "DASH_SHARED_WITH_MY_TEAM_OVERVIEW",
      "DASH_SHARED_WITH_MY_TEAM",
      "DASH_SHARED_WITH_OTHERS",
      "DASH_TASKS",
      "DASH_VIOLATIONS_CATEGORY_REGION",
      "DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS",
      "DASH_WORKFLOW_TEAM",
      "DASH_WORKFLOW",
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
      "FIND_TRACING_MATCH",
      "FLAG",
      "FLAG_RESOLVE_ANY",
      "GBV_STATISTICS",
      "GROUP_READ",
      "INCIDENT_DETAILS_FROM_CASE",
      "INCIDENT_FROM_CASE",
      "LINK_INCIDENT_TO_CASE",
      "KPI_ASSESSMENT_STATUS",
      "KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE",
      "KPI_AVERAGE_REFERRALS",
      "KPI_CASE_CLOSURE_RATE",
      "KPI_CASE_LOAD",
      "KPI_CLIENT_SATISFACTION_RATE",
      "KPI_COMPLETED_CASE_ACTION_PLANS",
      "KPI_COMPLETED_CASE_SAFETY_PLANS",
      "KPI_COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS",
      "KPI_NUMBER_OF_CASES",
      "KPI_NUMBER_OF_INCIDENTS",
      "KPI_REPORTING_DELAY",
      "KPI_SERVICES_PROVIDED",
      "KPI_SUPERVISOR_TO_CASEWORKER_RATIO",
      "KPI_TIME_FROM_CASE_OPEN_TO_CLOSE",
      "LINK_FAMILY_RECORD",
      "MANAGE",
      "MARK_FOR_OFFLINE",
      "READ",
      "RECEIVE_REFERRAL",
      "RECEIVE_TRANSFER",
      "REFERRAL_FROM_SERVICE",
      "REFERRAL",
      "REFERRALS_TRANSFERS_REPORT",
      "REMOVE_ASSIGNED_USERS",
      "REOPEN",
      "REQUEST_APPROVAL_ACTION_PLAN",
      "REQUEST_APPROVAL_ASSESSMENT",
      "REQUEST_APPROVAL_CASE_PLAN",
      "REQUEST_APPROVAL_CLOSURE",
      "REQUEST_APPROVAL_GBV_CLOSURE",
      "REQUEST_TRANSFER",
      "SEARCH_OWNED_BY_OTHERS",
      "SERVICES_SECTION_FROM_CASE",
      "WORKFLOW_REPORT",
      "SYNC_EXTERNAL",
      "TRANSFER",
      "VERIFY_MRM",
      "VIEW_FAMILY_RECORD",
      "VIEW_INCIDENT_FROM_CASE",
      "VIEW_REGISTRY_RECORD",
      "VIOLATIONS",
      "WRITE",
      "REMOVE_ALERT"
    ].forEach(property => {
      expect(permissions).toHaveProperty(property);
      expect(typeof permissions[property]).toBe("string");
      delete permissions[property];
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have known RESOURCES", () => {
    const resources = { ...PERMISSIONS.RESOURCES };

    [
      "activity_logs",
      "agencies",
      "any",
      "audit_logs",
      "cases",
      "codes_of_conduct",
      "configurations",
      "contact_information",
      "dashboards",
      "families",
      "forms",
      "incidents",
      "kpis",
      "locations",
      "lookups",
      "managed_reports",
      "metadata",
      "potential_matches",
      "registry_records",
      "reports",
      "roles",
      "systems",
      "tracing_requests",
      "usage_reports",
      "user_groups",
      "users",
      "webhooks"
    ].forEach(property => {
      expect(resources).toHaveProperty(property);
      expect(typeof resources[property]).toBe("string");
      delete resources[property];
    });
    expect(Object.keys(resources)).toHaveLength(0);
  });

  it("should have CREATE_REPORTS", () => {
    const permissions = [...PERMISSIONS.CREATE_REPORTS];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.CREATE, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have READ_REPORTS", () => {
    const permissions = [...PERMISSIONS.READ_REPORTS];

    expect(Array.isArray(permissions)).toBe(true);
    [
      PERMISSIONS.ACTIONS.READ,
      PERMISSIONS.ACTIONS.GROUP_READ,
      PERMISSIONS.ACTIONS.MANAGE,
      PERMISSIONS.ACTIONS.AGENCY_READ
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have EXPORT_CUSTOM", () => {
    const permissions = [...PERMISSIONS.EXPORT_CUSTOM];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.EXPORT_CUSTOM, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have CREATE_RECORDS", () => {
    const permissions = [...PERMISSIONS.CREATE_RECORDS];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.CREATE, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });

    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have WRITE_RECORDS", () => {
    const permissions = [...PERMISSIONS.WRITE_RECORDS];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.MANAGE, PERMISSIONS.ACTIONS.WRITE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have READ_RECORDS", () => {
    const permissions = [...PERMISSIONS.READ_RECORDS];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.MANAGE, PERMISSIONS.ACTIONS.READ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have ENABLE_DISABLE_RECORD", () => {
    const permissions = [...PERMISSIONS.ENABLE_DISABLE_RECORD];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.ENABLE_DISABLE_RECORD, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have FLAG_RECORDS", () => {
    const permissions = [...PERMISSIONS.FLAG_RECORDS];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.FLAG, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have ADD_NOTE", () => {
    const permissions = [...PERMISSIONS.ADD_NOTE];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.ADD_NOTE, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have DISPLAY_VIEW_PAGE", () => {
    const permissions = [...PERMISSIONS.DISPLAY_VIEW_PAGE];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.DISPLAY_VIEW_PAGE, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have SHOW_TASKS", () => {
    const permissions = [...PERMISSIONS.SHOW_TASKS];

    expect(Array.isArray(permissions)).toBe(true);
    [PERMISSIONS.ACTIONS.DASH_TASKS, PERMISSIONS.ACTIONS.MANAGE].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have SHOW_EXPORTS", () => {
    const permissions = [...PERMISSIONS.SHOW_EXPORTS];

    expect(Array.isArray(permissions)).toBe(true);
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
      PERMISSIONS.ACTIONS.EXPORT_PHOTO_WALL,
      PERMISSIONS.ACTIONS.EXPORT_UNHCR,
      PERMISSIONS.ACTIONS.EXPORT_PDF,
      PERMISSIONS.ACTIONS.MANAGE
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have DASH_APPROVALS_PENDING", () => {
    const permissions = [...PERMISSIONS.DASH_APPROVALS_PENDING];

    expect(Array.isArray(permissions)).toBe(true);
    [
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ASSESSMENT_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CASE_PLAN_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CLOSURE_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ACTION_PLAN_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_GBV_CLOSURE_PENDING
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have DASH_APPROVALS", () => {
    const permissions = [...PERMISSIONS.DASH_APPROVALS];

    expect(Array.isArray(permissions)).toBe(true);
    [
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ASSESSMENT_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CASE_PLAN_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CLOSURE_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ACTION_PLAN_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_GBV_CLOSURE_PENDING,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ASSESSMENT,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CASE_PLAN,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_CLOSURE,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_ACTION_PLAN,
      PERMISSIONS.ACTIONS.DASH_APPROVALS_GBV_CLOSURE
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have GROUP_PERMISSIONS", () => {
    const groupPermissions = { ...PERMISSIONS.GROUP_PERMISSIONS };

    ["AGENCY", "ALL", "GROUP", "SELF"].forEach(property => {
      expect(groupPermissions).toHaveProperty(property);
      expect(typeof groupPermissions[property]).toBe("string");
      delete groupPermissions[property];
    });
    expect(Object.keys(groupPermissions)).toHaveLength(0);
  });

  it("should have REQUEST_APPROVAL", () => {
    const permissions = [...PERMISSIONS.REQUEST_APPROVAL];

    expect(Array.isArray(permissions)).toBe(true);
    [
      PERMISSIONS.ACTIONS.MANAGE,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_ASSESSMENT,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CLOSURE,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_ACTION_PLAN,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_GBV_CLOSURE
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have APPROVAL", () => {
    const permissions = [...PERMISSIONS.APPROVAL];

    expect(Array.isArray(permissions)).toBe(true);
    [
      PERMISSIONS.ACTIONS.APPROVE_ASSESSMENT,
      PERMISSIONS.ACTIONS.APPROVE_CASE_PLAN,
      PERMISSIONS.ACTIONS.APPROVE_CLOSURE,
      PERMISSIONS.ACTIONS.APPROVE_ACTION_PLAN,
      PERMISSIONS.ACTIONS.APPROVE_GBV_CLOSURE,
      PERMISSIONS.ACTIONS.MANAGE
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have SHOW_APPROVALS", () => {
    const permissions = [...PERMISSIONS.SHOW_APPROVALS];

    expect(Array.isArray(permissions)).toBe(true);
    [
      PERMISSIONS.ACTIONS.APPROVE_ASSESSMENT,
      PERMISSIONS.ACTIONS.APPROVE_CASE_PLAN,
      PERMISSIONS.ACTIONS.APPROVE_CLOSURE,
      PERMISSIONS.ACTIONS.APPROVE_ACTION_PLAN,
      PERMISSIONS.ACTIONS.APPROVE_GBV_CLOSURE,
      PERMISSIONS.ACTIONS.MANAGE,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_ASSESSMENT,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_CLOSURE,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_ACTION_PLAN,
      PERMISSIONS.ACTIONS.REQUEST_APPROVAL_GBV_CLOSURE
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });

  it("should have EXPORTS_PERMISSIONS", () => {
    const permissions = [...PERMISSIONS.EXPORTS_PERMISSIONS];

    expect(Array.isArray(permissions)).toBe(true);
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
      PERMISSIONS.ACTIONS.EXPORT_PHOTO_WALL,
      PERMISSIONS.ACTIONS.EXPORT_UNHCR,
      PERMISSIONS.ACTIONS.EXPORT_PDF
    ].forEach(element => {
      expect(permissions).toEqual(expect.arrayContaining([element]));
      permissions.splice(permissions.indexOf(element), 1);
    });
    expect(Object.keys(permissions)).toHaveLength(0);
  });
});
