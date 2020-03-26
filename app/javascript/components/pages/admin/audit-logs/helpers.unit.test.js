import { fromJS } from "immutable";

import { expect } from "../../../../test";

import * as helper from "./helpers";

describe("<AuditLogs /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["searchableUsers", "buildAuditLogsQuery"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
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
});
