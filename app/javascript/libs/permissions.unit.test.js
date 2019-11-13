import { expect } from "chai";
import { List } from "immutable";

import { PERMISSION_CONSTANTS, checkPermissions } from "./permissions";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const permissions = { ...PERMISSION_CONSTANTS };

    expect(permissions).to.have.property("MANAGE");
    expect(permissions).to.have.property("ASSIGN");
    expect(permissions).to.have.property("ASSIGN_WITHIN_USER_GROUP");
    expect(permissions).to.have.property("ASSIGN_WITHIN_AGENCY_PERMISSIONS");
    expect(permissions).to.have.property("REOPEN");
    expect(permissions).to.have.property("CLOSE");
    expect(permissions).to.have.property("ENABLE_DISABLE_RECORD");
    expect(permissions).to.have.property("ADD_NOTE");
    expect(permissions).to.have.property("READ");
    expect(permissions).to.have.property("REFERRAL");
    expect(permissions).to.have.property("TRANSFER");
    expect(permissions).to.have.property("DISPLAY_VIEW_PAGE");
    expect(permissions).to.have.property("SEARCH_OWNED_BY_OTHERS");
    expect(permissions).to.have.property("DASH_TASKS");
    expect(permissions).to.have.property("GROUP_READ");
    expect(permissions).to.have.property("CREATE");
    expect(permissions).to.have.property("WRITE");
    expect(permissions).to.have.property("EXPORT_LIST_VIEW");
    expect(permissions).to.have.property("EXPORT_CSV");
    expect(permissions).to.have.property("EXPORT_EXCEL");
    expect(permissions).to.have.property("EXPORT_JSON");
    expect(permissions).to.have.property("EXPORT_PHOTO_WALL");
    expect(permissions).to.have.property("EXPORT_PDF");
    expect(permissions).to.have.property("EXPORT_UNHCR");
    expect(permissions).to.have.property("EXPORT_DUPLICATE_ID");
    expect(permissions).to.have.property("EXPORT_CASE_PDF");
    expect(permissions).to.have.property("EXPORT_MRM_VIOLATION_XLS");
    expect(permissions).to.have.property("EXPORT_INCIDENT_RECORDER");
    expect(permissions).to.have.property("EXPORT_CUSTOM");

    delete permissions.MANAGE;
    delete permissions.ASSIGN;
    delete permissions.ASSIGN_WITHIN_USER_GROUP;
    delete permissions.ASSIGN_WITHIN_AGENCY_PERMISSIONS;
    delete permissions.REOPEN;
    delete permissions.CLOSE;
    delete permissions.ENABLE_DISABLE_RECORD;
    delete permissions.ADD_NOTE;
    delete permissions.READ;
    delete permissions.REFERRAL;
    delete permissions.TRANSFER;
    delete permissions.DISPLAY_VIEW_PAGE;
    delete permissions.SEARCH_OWNED_BY_OTHERS;
    delete permissions.DASH_TASKS;
    delete permissions.GROUP_READ;
    delete permissions.CREATE;
    delete permissions.WRITE;
    delete permissions.EXPORT_LIST_VIEW;
    delete permissions.EXPORT_CSV;
    delete permissions.EXPORT_EXCEL;
    delete permissions.EXPORT_JSON;
    delete permissions.EXPORT_PHOTO_WALL;
    delete permissions.EXPORT_PDF;
    delete permissions.EXPORT_UNHCR;
    delete permissions.EXPORT_DUPLICATE_ID;
    delete permissions.EXPORT_CASE_PDF;
    delete permissions.EXPORT_MRM_VIOLATION_XLS;
    delete permissions.EXPORT_INCIDENT_RECORDER;
    delete permissions.EXPORT_CUSTOM;

    expect(permissions).to.deep.equal({});
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
