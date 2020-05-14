import { fromJS } from "immutable";

import { TIMESTAMP, USER_NAME } from "./constants";
import * as helper from "./utils";

describe("<AuditLogs /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["buildAuditLogsQuery", "getFilters", "searchableUsers"].forEach(
        property => {
          expect(clone).to.have.property(property);
          expect(clone[property]).to.be.a("function");
          delete clone[property];
        }
      );
      expect(clone).to.be.empty;
    });
  });

  describe("searchableUsers", () => {
    it("should convert the data for DashboardTable", () => {
      const data = fromJS([
        {
          id: 1,
          user_name: "user_test",
          name: "User test"
        }
      ]);

      const expected = [{ id: "user_test", display_name: "user_test" }];

      const converted = helper.searchableUsers(data);

      expect(converted).to.deep.equal(expected);
    });
  });

  describe("buildAuditLogsQuery", () => {
    it("should convert the data for DashboardTable", () => {
      const data = {
        user_name: { id: "user_test", display_name: "user_test" },
        timestamp: { from: "2020-01-01" }
      };

      const expected = {
        user_name: "user_test",
        timestamp: {
          from: "2020-01-01"
        }
      };

      const converted = helper.buildAuditLogsQuery(data);

      expect(converted).to.deep.equal(expected);
    });
  });

  describe("getFilters", () => {
    it("should convert the data for DashboardTable", () => {
      const data = fromJS([{ id: "user_test", display_name: "user_test" }]);

      const expected = [
        {
          name: "audit_log.timestamp",
          field_name: "audit_log_date",
          type: "dates",
          option_strings_source: null,
          dateIncludeTime: true,
          options: { en: [{ id: TIMESTAMP, display_name: "Timestamp" }] }
        },
        {
          name: "audit_log.user_name",
          field_name: USER_NAME,
          option_strings_source: null,
          options: helper.searchableUsers(data),
          type: "multi_select",
          multiple: false
        }
      ];

      expect(helper.getFilters(data)).to.deep.equal(expected);
    });
  });
});
