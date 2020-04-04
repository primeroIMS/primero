import { fromJS } from "immutable";

import { expect } from "../../../../test";

import * as helpers from "./utils";

describe("pages/admin/<RolesForm> - utils", () => {
  describe("getFormsToRender", () => {
    it("should return the forms to render", () => {
      const formsToRender = helpers.getFormsToRender({
        primeroModules: fromJS([]),
        systemPermissions: fromJS({}),
        roles: fromJS([]),
        agencies: fromJS([]),
        roleActions: fromJS([]),
        agencyActions: fromJS([]),
        formSections: fromJS([]),
        i18n: { t: () => "" }
      });

      expect(formsToRender).to.have.sizeOf(7);
    });
  });

  describe("mergeFormSections", () => {
    it("should return the form sections merged in a single array", () => {
      const data = {
        form_section_unique_ids: {
          case: ["case_form_1"],
          tracing_request: ["tracing_request_form_1"],
          incident: ["incident_form_1"]
        }
      };

      const expected = [
        "case_form_1",
        "tracing_request_form_1",
        "incident_form_1"
      ];

      expect(
        helpers.mergeFormSections(data).form_section_unique_ids
      ).to.deep.equal(expected);
    });
  });
});
