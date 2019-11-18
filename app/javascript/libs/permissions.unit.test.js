import { expect } from "chai";
import { List } from "immutable";

import {
  PERMISSION_CONSTANTS,
  RESOURCES,
  CREATE_REPORTS_PERMSSIONS,
  EXPORT_CUSTOM_PERMSSIONS,
  checkPermissions
} from "./permissions";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const permissions = { ...PERMISSION_CONSTANTS };

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
      "EXPORT_CUSTOM"
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

      expect(checkPermissions(currentPermissions, allowedPermissions)).to.equal(
        true
      );
    });
    it("should send false because current permission is not allowed", () => {
      const currentPermissions = List(["manage"]);
      const allowedPermissions = ["read"];

      expect(checkPermissions(currentPermissions, allowedPermissions)).to.equal(
        false
      );
    });
  });

  it("should have known RESOURCES", () => {
    const resources = { ...RESOURCES };

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

  it("should have CREATE_REPORTS_PERMSSIONS", () => {
    const permissions = [...CREATE_REPORTS_PERMSSIONS];

    expect(permissions).to.be.a("array");
    ["create", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });

  it("should have EXPORT_CUSTOM_PERMSSIONS", () => {
    const permissions = [...EXPORT_CUSTOM_PERMSSIONS];

    expect(permissions).to.be.a("array");
    ["create", "manage"].forEach(element => {
      expect(element).to.be.a("string");
      permissions.shift();
    });
    expect(permissions).to.be.empty;
  });
});
