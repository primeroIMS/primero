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
    delete permissions.SEARCH_OWNED_BY_OTHERS

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
