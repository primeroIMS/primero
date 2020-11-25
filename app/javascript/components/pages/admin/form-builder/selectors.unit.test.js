import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("<FormsBuilder /> - Selectors", () => {
  it("should know the selectors", () => {
    const clonedSelectors = { ...selectors };

    [
      "getCopiedFields",
      "getFieldNames",
      "getFormUniqueIds",
      "getRemovedFields",
      "getSavingRecord",
      "getSelectedField",
      "getSelectedFields",
      "getSelectedForm",
      "getSelectedSubform",
      "getSelectedSubforms",
      "getSelectedSubformField",
      "getServerErrors",
      "getUpdatedFormIds"
    ].forEach(property => {
      expect(clonedSelectors).to.have.property(property);
      delete clonedSelectors[property];
    });
    expect(clonedSelectors).to.be.empty;
  });

  describe("getSavingRecord", () => {
    const initialState = fromJS({
      records: {
        admin: {
          forms: {
            saving: true
          }
        }
      }
    });

    it("should return the correct value", () => {
      expect(selectors.getSavingRecord(initialState)).to.be.true;
    });
  });

  describe("getSelectedForm", () => {
    const selectedForm = fromJS({ id: 1, name: { en: "Form ID 1" } });
    const initialState = fromJS({
      records: { admin: { forms: { selectedForm } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getSelectedForm(initialState)).to.deep.equal(selectedForm);
    });
  });

  describe("getSelectedSubform", () => {
    const selectedSubform = fromJS({
      id: 1,
      name: { en: "SubForm ID 1" }
    });
    const initialState = fromJS({
      records: { admin: { forms: { selectedSubform } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getSelectedSubform(initialState)).to.deep.equal(selectedSubform);
    });
  });

  describe("getSelectedSubforms", () => {
    const subforms = fromJS([
      { id: 1, name: { en: "SubForm ID 1" } },
      { id: 1, name: { en: "SubForm ID 2" } },
      { id: 1, name: { en: "SubForm ID 3" } }
    ]);
    const initialState = fromJS({
      records: { admin: { forms: { subforms } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getSelectedSubforms(initialState)).to.deep.equal(subforms);
    });
  });

  describe("getSelectedFields", () => {
    const selectedFields = fromJS([
      { id: 1, name: "field_1" },
      { id: 2, name: "field_2" }
    ]);
    const subformFields = fromJS([
      { id: 1, name: "subform_field_1" },
      { id: 2, name: "subform_field_2" }
    ]);
    const selectedSubform = fromJS({
      id: 1,
      name: { en: "SubForm ID 1" },
      fields: subformFields
    });
    const initialState = fromJS({
      records: { admin: { forms: { selectedFields, selectedSubform } } }
    });

    it("should return the selected fields", () => {
      expect(selectors.getSelectedFields(initialState)).to.deep.equal(selectedFields);
    });

    it("should return the selected fields for the selected subform", () => {
      expect(selectors.getSelectedFields(initialState, true)).to.deep.equal(subformFields);
    });
  });

  describe("getSelectedField", () => {
    const selectedField = fromJS({ id: 1, name: "field_1" });

    const initialState = fromJS({
      records: { admin: { forms: { selectedField } } }
    });

    it("should return the selected field", () => {
      expect(selectors.getSelectedField(initialState)).to.deep.equal(selectedField);
    });
  });

  describe("getSavingRecord", () => {
    const initialState = fromJS({
      records: { admin: { forms: { saving: true } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getSavingRecord(initialState)).to.be.true;
    });
  });

  describe("getServerErrors", () => {
    const serverErrors = fromJS([{ error: true, status: 404 }]);
    const initialState = fromJS({
      records: { admin: { forms: { serverErrors } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getServerErrors(initialState)).to.deep.equal(serverErrors);
    });
  });

  describe("getUpdatedFormIds", () => {
    const updatedFormIds = fromJS([1, 2, 3, 4]);
    const initialState = fromJS({
      records: { admin: { forms: { updatedFormIds } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getUpdatedFormIds(initialState)).to.deep.equal(updatedFormIds);
    });
  });

  describe("getSelectedFormUniqueIds", () => {
    const formUniqueIds = fromJS(["form_section_2", "form_section_3"]);

    const initialState = fromJS({
      records: {
        admin: {
          forms: {
            formSections: { "1": { id: 1, unique_id: "form_section_2" } },
            subforms: [{ unique_id: "form_section_3" }]
          }
        }
      }
    });

    it("should return the correct value", () => {
      expect(selectors.getFormUniqueIds(initialState)).to.deep.equal(formUniqueIds);
    });
  });

  describe("getFieldNames", () => {
    const fieldNames = fromJS(["field_1", "field_2", "field_3"]);

    const initialState = fromJS({
      records: {
        admin: {
          forms: {
            formSections: { "1": { id: 1, unique_id: "form_section_2" } },
            fields: { "1": { id: 1, name: "field_1" } },
            selectedSubform: { unique_id: "form_section_3", fields: [{ name: "field_2" }] },
            subforms: [{ unique_id: "form_section_3", fields: [{ name: "field_3" }] }]
          }
        }
      }
    });

    it("should return all the field names", () => {
      expect(selectors.getFieldNames(initialState)).to.deep.equal(fieldNames);
    });
  });

  describe("getCopiedFields", () => {
    const copiedFields = fromJS([
      { id: 1, name: "field_1" },
      { id: 2, name: "field_2" },
      { id: 3, name: "field_3" }
    ]);

    const initialState = fromJS({
      records: {
        admin: {
          forms: {
            copiedFields
          }
        }
      }
    });

    it("should return the copied fields", () => {
      expect(selectors.getCopiedFields(initialState)).to.deep.equal(copiedFields);
    });
  });

  describe("getRemovedFields", () => {
    const removedFields = fromJS([
      { id: 4, name: "field_4" },
      { id: 3, name: "field_3" },
      { id: 1, name: "field_1" }
    ]);

    const initialState = fromJS({
      records: {
        admin: {
          forms: {
            removedFields
          }
        }
      }
    });

    it("should return the removed fields", () => {
      expect(selectors.getRemovedFields(initialState)).to.deep.equal(removedFields);
    });
  });
});
