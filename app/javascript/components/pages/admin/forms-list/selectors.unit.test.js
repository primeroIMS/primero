import { fromJS } from "immutable";

import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord } from "../../../record-form/records";

import {
  getFormSections,
  getFormSectionsByFormGroup,
  getIsLoading,
  getReorderIsLoading,
  getReorderErrors,
  getReorderPendings,
  getReorderEnabled
} from "./selectors";

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

const pending = fromJS([1, 2, 3]);

const errors = fromJS([{ message: "Error 1" }]);

const stateWithReorderHeaders = fromJS({
  records: {
    admin: {
      forms: {
        reorderedForms: {
          loading: true,
          errors,
          pending,
          enabled: false
        }
      }
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<FormList /> - Selectors", () => {
  describe("getFormSectionsByFormGroup", () => {
    it("should return filtered form sections by group", () => {
      const formGroups = getFormSectionsByFormGroup(stateWithHeaders, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(formGroups.getIn([0, 0, "id"])).to.equal(5);
      expect(formGroups.getIn([1, 0, "id"])).to.equal(1);
      expect(formGroups.getIn([1, 1, "id"])).to.equal(2);
    });

    it("should filter out subforms", () => {
      const formGroups = getFormSectionsByFormGroup(stateWithHeaders, {
        primeroModule: "primeromodule-gbv",
        recordType: "incident"
      });

      expect(formGroups.getIn([0, 0, "id"])).to.equal(3);
      expect(formGroups.getIn([1, 0, "id"], false)).to.equal(false);
    });

    it("should return empty object when form sections empty", () => {
      const formGroups = getFormSectionsByFormGroup(stateWithoutHeaders, {
        primeroModule: "primeromodule-cp",
        recordType: "incident"
      });

      expect(formGroups).to.deep.equal(fromJS([]));
    });
  });

  describe("getFormSections", () => {
    it("should return the filtered form sections", () => {
      const forms = getFormSections(stateWithHeaders, {
        primeroModule: "primeromodule-cp",
        recordType: "case"
      });

      expect(forms.size).to.equal(3);
    });
  });

  describe("getIsLoading", () => {
    it("should return true if the forms are loading", () => {
      const isLoading = getIsLoading(
        fromJS({
          records: {
            admin: {
              forms: {
                loading: true
              }
            }
          }
        })
      );

      expect(isLoading).to.be.true;
    });
  });

  describe("getReorderIsLoading", () => {
    it("should return true if the reorder is loading", () => {
      const isLoading = getReorderIsLoading(stateWithReorderHeaders);

      expect(isLoading).to.be.true;
    });
  });

  describe("getReorderErrors", () => {
    it("should return an array of errors", () => {
      const reorderErrors = getReorderErrors(stateWithReorderHeaders);

      expect(reorderErrors).to.deep.equal(errors);
    });
  });

  describe("getReorderPendings", () => {
    it("should return an array of pending ids to be reordered", () => {
      const pendingForms = getReorderPendings(stateWithReorderHeaders);

      expect(pendingForms).to.deep.equal(pending);
    });
  });

  describe("getReorderEnabled", () => {
    it("should return if the reorder functionality is enabled", () => {
      const enabled = getReorderEnabled(stateWithReorderHeaders);

      expect(enabled).to.deep.equal(false);
    });
  });
});
