import { fromJS } from "immutable";

import { expect } from "../../../../test";

import { getFilterUsers } from "./selectors";

const state = fromJS({
  records: {
    admin: {
      audit_logs: {
        users: {
          data: [
            {
              id: 1,
              full_name: "User Test",
              email: "user_test@primero.com",
              module_unique_ids: ["primeromodule-test"],
              user_name: "user_test"
            }
          ]
        }
      }
    }
  }
});

const emptyState = fromJS({});

describe("<AuditLogs /> - pages/admin/audit-logs/selectors", () => {
  describe("getFilterUsers", () => {
    it("should return list of users", () => {
      const expected = fromJS([
        {
          id: 1,
          full_name: "User Test",
          email: "user_test@primero.com",
          module_unique_ids: ["primeromodule-test"],
          user_name: "user_test"
        }
      ]);
      const records = getFilterUsers(state);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty list when no users", () => {
      const records = getFilterUsers(emptyState);

      expect(records).to.be.empty;
    });
  });
});
