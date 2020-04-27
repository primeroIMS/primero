import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord } from "../../../record-form/records";

import { getFormSections } from "./selectors";

const formSections = [
  {
    id: 1,
    unique_id: "form_section_1",
    parent_form: "case",
    module_ids: ["primeromodule-cp"],
    order: 1,
    form_group_id: "group_1",
    order_form_group: 2
  },
  {
    id: 2,
    unique_id: "form_section_2",
    parent_form: "case",
    module_ids: ["primeromodule-cp"],
    order: 2,
    form_group_id: "group_1",
    order_form_group: 2
  },
  {
    id: 3,
    unique_id: "form_section_3",
    parent_form: "incident",
    module_ids: ["primeromodule-gbv"],
    order: 1,
    form_group_id: "group_2",
    order_form_group: 1
  },
  {
    id: 4,
    unique_id: "form_section_4",
    parent_form: "incident",
    module_ids: ["primeromodule-gbv"],
    order: 1,
    form_group_id: "group_3",
    order_form_group: 2,
    is_nested: true
  },
  {
    id: 5,
    unique_id: "form_section_5",
    parent_form: "case",
    module_ids: ["primeromodule-cp"],
    order: 1,
    form_group_id: "group_2",
    order_form_group: 1
  }
];

const stateWithHeaders = fromJS({
  records: {
    admin: {
      forms: {
        formSections: mapEntriesToRecord(formSections, FormSectionRecord, true)
      }
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<FormList /> - Selectors", () => {
  describe("getFormSections", () => {
    it("should return filtered form sections by group", () => {
      const formGroups = getFormSections(stateWithHeaders, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(formGroups.getIn([0, 0, "id"])).to.equal(1);
      expect(formGroups.getIn([0, 1, "id"])).to.equal(2);
      expect(formGroups.getIn([1, 0, "id"])).to.equal(5);
    });

    it("should filter out subforms", () => {
      const formGroups = getFormSections(stateWithHeaders, {
        primeroModule: "primeromodule-gbv",
        recordType: "incident"
      });

      expect(formGroups.getIn([0, 0, "id"])).to.equal(3);
      expect(formGroups.getIn([1, 0, "id"], false)).to.equal(false);
    });

    it("should return empty object when form sections empty", () => {
      const formGroups = getFormSections(stateWithoutHeaders, {
        primeroModule: "primeromodule-cp",
        recordType: "incident"
      });

      expect(formGroups).to.deep.equal(fromJS([]));
    });
  });
});
