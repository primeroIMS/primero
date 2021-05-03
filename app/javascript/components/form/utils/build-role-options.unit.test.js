import { expect } from "chai";
import { fromJS } from "immutable";

import buildRoleOptions from "./build-role-options";

describe("form/utils/build-role-options", () => {
  describe("buildRoleOptions()", () => {
    it("should return the roles as options", () => {
      const roles = fromJS([
        { unique_id: "role_1", name: "Role 1", disabled: false },
        { unique_id: "role_2", name: "Role 2", disabled: false }
      ]);

      const expected = [
        { id: "role_1", display_text: "Role 1", disabled: false },
        { id: "role_2", display_text: "Role 2", disabled: false }
      ];

      expect(buildRoleOptions(roles)).to.deep.equal(expected);
    });
  });
});
