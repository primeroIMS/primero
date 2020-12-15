import { fromJS } from "immutable";

import { headersToColumns, getAdminResources } from "./utils";

describe("pages/admin/utils.js", () => {
  describe("headersToColumns", () => {
    it("should conver the headers to columns", () => {
      const i18n = { t: value => value };
      const expected = [
        {
          label: "Name",
          name: "name"
        },
        {
          label: "Description",
          name: "description"
        }
      ];
      const headers = [
        {
          name: "Name",
          field_name: "name"
        },
        {
          name: "Description",
          field_name: "description"
        }
      ];

      const result = headersToColumns(headers, i18n);

      expect(result).to.be.deep.equal(expected);
    });
  });

  describe("getAdminResources", () => {
    it("should return an array with keys of userPermissions", () => {
      const expected = ["users", "audit_logs"];
      const permissions = fromJS({
        audit_logs: ["manage"],
        roles: [],
        users: ["manage"]
      });

      expect(getAdminResources(permissions)).to.be.deep.equal(expected);
    });
  });
});
