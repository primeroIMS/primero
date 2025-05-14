// Copyright (c) 2014 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { getRecordValue } from "./utils";

describe("<AuditLogs /> - pages/admin/audit-logs/components/log-description-message/utils", () => {
  describe("getRecordValue", () => {
    it("should return the record ID if action is in ACTIONS_WITH_RECORD_ID", () => {
      const data = fromJS({
        record_id: 12345,
        action: "show_alerts"
      });

      const result = getRecordValue(data, "record_id");

      expect(result).toBe(12345);
    });

    it("should return the record display_name if action is in ACTIONS_WITH_RECORD_ID", () => {
      const data = fromJS({
        record_id: 12345,
        display_name: 67890,
        action: "flag"
      });

      const result = getRecordValue(data, "display_name");

      expect(result).toBe(67890);
    });

    it("should return an empty string if action is not in ACTIONS_WITH_RECORD_ID", () => {
      const data = fromJS([
        {
          record_id: 12345,
          action: "list"
        }
      ]);

      const result = getRecordValue(data, "record_id");

      expect(result).toBe("");
    });
  });
});
