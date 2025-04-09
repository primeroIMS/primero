// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<AuditLogs /> pages/admin/audit-logs/constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(typeof clone).toEqual("object");
    ["AUDIT_LOG", "DATA", "DEFAULT_FILTERS", "ERRORS", "LOADING", "METADATA", "NAME", "TIMESTAMP", "USER_NAME"].forEach(
      property => {
        expect(clone).toHaveProperty(property);
        delete clone[property];
      }
    );

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
