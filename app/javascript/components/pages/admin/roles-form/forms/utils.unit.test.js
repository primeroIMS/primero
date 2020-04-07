import { expect } from "../../../../../test";

import { buildPermissionOptions } from "./utils";

describe("pages/admin/<RolesForm>/forms - utils", () => {
  const i18n = { t: label => label };

  describe("buildPermissionOptions", () => {
    it("returns the action as option objects", () => {
      const actions = ["action_1", "action_2"];
      const expected = [
        {
          id: "action_1",
          display_text: "permissions.permission.action_1"
        },
        {
          id: "action_2",
          display_text: "permissions.permission.action_2"
        }
      ];

      expect(buildPermissionOptions(actions, i18n)).to.deep.equal(expected);
    });
  });
});
