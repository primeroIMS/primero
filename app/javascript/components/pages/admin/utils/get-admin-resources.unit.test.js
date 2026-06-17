import { fromJS } from "immutable";

import getAdminResources from "./get-admin-resources";

describe("pages/admin/utils/getAdminResources", () => {
  it("should return resources where the user has manage permission", () => {
    const expected = ["users", "audit_logs"];
    const permissions = fromJS({
      audit_logs: ["manage"],
      roles: [],
      users: ["manage"]
    });

    expect(getAdminResources(permissions)).toEqual(expected);
  });

  it("should return resources where the user has read permission", () => {
    const expected = ["users", "roles"];
    const permissions = fromJS({
      users: ["read"],
      roles: ["read"],
      audit_logs: []
    });

    expect(getAdminResources(permissions)).toEqual(expected);
  });

  it("should return resources where the user has write or create permission", () => {
    const expected = ["agencies"];
    const permissions = fromJS({
      agencies: ["write", "create"],
      roles: []
    });

    expect(getAdminResources(permissions)).toEqual(expected);
  });

  it("should return empty array when user has no admin permissions", () => {
    const permissions = fromJS({
      users: [],
      roles: []
    });

    expect(getAdminResources(permissions)).toEqual([]);
  });
});
