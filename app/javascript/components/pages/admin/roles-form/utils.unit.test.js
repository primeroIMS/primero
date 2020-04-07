import { fromJS, OrderedMap, Seq, Map } from "immutable";

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

      const expected = {
        form_section_unique_ids: [
          "case_form_1",
          "tracing_request_form_1",
          "incident_form_1"
        ]
      };

      expect(utils.mergeFormSections(data)).to.deep.equal(expected);
    });
  });

  describe("groupSelectedIdsByParentForm", () => {
    it("should group the selected forms by parent form", () => {
      const data = fromJS({
        form_section_unique_ids: ["form_section_1", "form_section_2"]
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
      const assignableForms = fromJS([
        formSection1,
        formSection2,
        formSection3
      ]);
      const expected = Map({
        form_section_unique_ids: OrderedMap({
          parent_1: Seq(["form_section_1"]),
          parent_2: Seq(["form_section_2"])
        })
      });
      const result = utils.groupSelectedIdsByParentForm(data, assignableForms);

      expect(result).to.deep.equal(expected);
    });
  });
});
