import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("<FormsBuilder /> - Selectors", () => {
  it("should know the selectors", () => {
    const clonedSelectors = { ...selectors };

    [
      "getSavingRecord",
      "getSelectedField",
      "getSelectedFields",
      "getSelectedForm",
      "getSelectedSubform",
      "getSelectedSubforms",
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
      expect(selectors.getSelectedForm(initialState)).to.deep.equal(
        selectedForm
      );
    });
  });

  describe("getSelectedSubform", () => {
    const selectedFieldSubform = fromJS({
      id: 1,
      name: { en: "SubForm ID 1" }
    });
    const initialState = fromJS({
      records: { admin: { forms: { selectedFieldSubform } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getSelectedSubform(initialState)).to.deep.equal(
        selectedFieldSubform
      );
    });
  });

  describe("getSelectedSubforms", () => {
    const selectedSubforms = fromJS([
      { id: 1, name: { en: "SubForm ID 1" } },
      { id: 1, name: { en: "SubForm ID 2" } },
      { id: 1, name: { en: "SubForm ID 3" } }
    ]);
    const initialState = fromJS({
      records: { admin: { forms: { selectedSubforms } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getSelectedSubforms(initialState)).to.deep.equal(
        selectedSubforms
      );
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
    const selectedFieldSubform = fromJS({
      id: 1,
      name: { en: "SubForm ID 1" },
      fields: subformFields
    });
    const initialState = fromJS({
      records: { admin: { forms: { selectedFields, selectedFieldSubform } } }
    });

    it("should return the selected fields", () => {
      expect(selectors.getSelectedFields(initialState)).to.deep.equal(
        selectedFields
      );
    });

    it("should return the selected fields for the selected subform", () => {
      expect(selectors.getSelectedFields(initialState, true)).to.deep.equal(
        subformFields
      );
    });
  });

  describe("getSelectedField", () => {
    const selectedField = fromJS({ id: 1, name: "field_1" });

    const initialState = fromJS({
      records: { admin: { forms: { selectedField } } }
    });

    it("should return the selected field", () => {
      expect(selectors.getSelectedField(initialState)).to.deep.equal(
        selectedField
      );
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
      expect(selectors.getServerErrors(initialState)).to.deep.equal(
        serverErrors
      );
    });
  });

  describe("getUpdatedFormIds", () => {
    const updatedFormIds = fromJS([1, 2, 3, 4]);
    const initialState = fromJS({
      records: { admin: { forms: { updatedFormIds } } }
    });

    it("should return the correct value", () => {
      expect(selectors.getUpdatedFormIds(initialState)).to.deep.equal(
        updatedFormIds
      );
    });
  });
});
