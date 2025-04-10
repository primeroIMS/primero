// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<AuditLogs /> - pages/admin/audit-logs/actions", () => {
  it("should have known actions", () => {
    const clone = { ...actions };

    [
      "FETCH_AUDIT_LOGS",
      "FETCH_AUDIT_LOGS_FAILURE",
      "FETCH_AUDIT_LOGS_FINISHED",
      "FETCH_AUDIT_LOGS_STARTED",
      "FETCH_AUDIT_LOGS_SUCCESS",
      "FETCH_PERFORMED_BY",
      "FETCH_PERFORMED_BY_FAILURE",
      "FETCH_PERFORMED_BY_FINISHED",
      "FETCH_PERFORMED_BY_STARTED",
      "FETCH_PERFORMED_BY_SUCCESS",
      "SET_AUDIT_LOGS_FILTER"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
