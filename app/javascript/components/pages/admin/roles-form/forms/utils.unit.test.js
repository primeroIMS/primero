import { buildPermissionOptions } from "./utils";

describe("pages/admin/<RolesForm>/forms - utils", () => {
  const i18n = { t: label => label };
  const approvalsLabels = {
    assessment: "Assessment"
  };

  describe("buildPermissionOptions", () => {
    it("returns the action as option objects", () => {
      const actions = ["action_1", "action_2", "request_approval_assessment"];
      const expected = [
        {
          id: "action_1",
          display_text: "permissions.permission.action_1"
        },
        {
          id: "action_2",
          display_text: "permissions.permission.action_2"
        },
        {
          id: "request_approval_assessment",
          display_text: "permissions.permission.request_approval_assessment"
        }
      ];

      expect(
        buildPermissionOptions(actions, i18n, approvalsLabels)
      ).to.deep.equal(expected);
    });
  });
});
