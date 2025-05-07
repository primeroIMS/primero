// Copyright (c) 2014 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { getRecordID } from "./utils";

describe("<AuditLogs /> - pages/admin/audit-logs/components/log-description-message/utils", () => {
  describe("getRecordID", () => {
    it("should return the record ID if action is in ACTIONS_WITH_RECORD_ID", () => {
      const data = fromJS({
        record_id: 12345,
        action: "show_alerts"
      });

      const result = getRecordID(data);

      expect(result).toBe(12345);
    });

    it("should return an empty string if record ID is not present", () => {
      const data = fromJS([
        {
          record_id: 12345,
          action: "list"
        }
      ]);

      const result = getRecordID(data);

      expect(result).toBe("");
    });
  });
});
