import { Map } from "immutable";

import { buildAdminLevelSelect, buildPermissionOptions } from "./utils";

describe("pages/admin/<RolesForm>/forms - utils", () => {
  const i18n = { t: label => label };
  const approvalsLabels = {
    assessment: "Assessment",
    gbv_closure: "GBV Closure"
  };

  describe("buildPermissionOptions", () => {
    it("returns the action as option objects", () => {
      const actions = ["action_1", "action_2", "request_approval_assessment", "approve_gbv_closure"];
      const expected = [
        {
          id: "action_1",
          display_text: "permissions.resource.case.actions.action_1.label",
          tooltip: "permissions.resource.case.actions.action_1.explanation"
        },
        {
          id: "action_2",
          display_text: "permissions.resource.case.actions.action_2.label",
          tooltip: "permissions.resource.case.actions.action_2.explanation"
        },
        {
          id: "request_approval_assessment",
          display_text: "permissions.resource.case.actions.request_approval_assessment.label",
          tooltip: "permissions.resource.case.actions.request_approval_assessment.explanation"
        },
        {
          id: "approve_gbv_closure",
          display_text: "permissions.resource.case.actions.approve_gbv_closure.label",
          tooltip: "permissions.resource.case.actions.approve_gbv_closure.explanation"
        }
      ];

      expect(buildPermissionOptions(actions, i18n, "case", approvalsLabels)).to.deep.equal(expected);
    });
  });

  describe("buildAdminLevelSelect", () => {
    const adminLevelMap = Map({
      "1": ["province"],
      "2": ["district", "test"]
    });

    it("should return an array of objects to be used as option_strings_text", () => {
      const expected = [
        {
          id: 1,
          display_text: "Province"
        },
        {
          id: 2,
          display_text: "District, Test"
        }
      ];

      expect(buildAdminLevelSelect(adminLevelMap)).to.deep.equal(expected);
    });
  });
});
