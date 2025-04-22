// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import getAdminResources from "./get-admin-resources";

describe("pages/admin/utils/getAdminResources", () => {
  it("should return an array with keys of userPermissions", () => {
    const expected = ["users", "audit_logs"];
    const permissions = fromJS({
      audit_logs: ["manage"],
      roles: [],
      users: ["manage"]
    });

    expect(getAdminResources(permissions)).toEqual(expected);
  });
});
