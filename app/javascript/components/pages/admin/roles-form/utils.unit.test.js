import { fromJS } from "immutable";

import * as utils from "./utils";

describe("pages/admin/<RolesForm> - utils", () => {
  describe("getFormsToRender", () => {
    it("should return the forms to render", () => {
      const formsToRender = utils.getFormsToRender({
        primeroModules: fromJS([]),
        systemPermissions: fromJS({}),
        roles: fromJS([]),
        agencies: fromJS([]),
        roleActions: fromJS([]),
        agencyActions: fromJS([]),
        formSections: fromJS([]),
        i18n: { t: () => "" },
        approvalsLabels: {},
        adminLevelMap: fromJS({})
      });

      expect(formsToRender).to.have.sizeOf(6);
    });
  });

  describe("mergeFormSections", () => {
    it("should return the form sections merged in a single object", () => {
      const data = {
        form_section_read_write: {
          case: { case_form_1: "read" },
          tracing_request: { tracing_request_form_1: "hide" },
          incident: { incident_form_1: "read_write" }
        }
      };

      const expected = {
        form_section_read_write: {
          case_form_1: "r",
          incident_form_1: "rw"
        }
      };

      expect(utils.mergeFormSections(data)).to.deep.equal(expected);
    });

    it("should keep empty those form sections without values", () => {
      const data = {
        form_section_read_write: {
          case: { case_form_1: "" },
          incident: { incident_form_1: "read_write" }
        }
      };

      const expected = {
        form_section_read_write: {
          case_form_1: "",
          incident_form_1: "rw"
        }
      };

      expect(utils.mergeFormSections(data)).to.deep.equal(expected);
    });
  });

  describe("groupSelectedIdsByParentForm", () => {
    it("should group the selected forms by parent form", () => {
      const data = fromJS({
        form_section_read_write: ["form_section_1", "form_section_2"]
      });
      const formSection1 = {
        unique_id: "form_section_1",
        parent_form: "parent_1"
      };
      const formSection2 = {
        unique_id: "form_section_2",
        parent_form: "parent_2"
      };
      const formSection3 = {
        unique_id: "form_section_3",
        parent_form: "parent_1"
      };
      const assignableForms = fromJS([formSection1, formSection2, formSection3]);
      const expected = fromJS({
        form_section_read_write: {
          parent_1: { form_section_1: "hide", form_section_3: "hide" },
          parent_2: { form_section_2: "hide" }
        }
      });
      const result = utils.groupSelectedIdsByParentForm(data, assignableForms);

      expect(result).to.deep.equal(expected);
    });
  });
});
