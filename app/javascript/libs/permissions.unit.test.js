import { expect } from "chai";
import { List } from "immutable";

import { PERMISSION_CONSTANTS, checkPermissions } from "./permissions";

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
      expect(
        checkPermissions(currentPermissions, allowedPermissions)
      ).to.equal(true);
    });
    it("should send false because current permission is not allowed", () => {
      const currentPermissions = List(["manage"]);
      const allowedPermissions = ["read"];
      expect(
        checkPermissions(currentPermissions, allowedPermissions)
      ).to.equal(false);
    });
  });
});
