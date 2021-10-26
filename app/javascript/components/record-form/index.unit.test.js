import * as index from "./index";

describe("<RecordForms /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "constructInitialValues",
      "FieldRecord",
      "fetchAgencies",
      "fetchForms",
      "fetchLookups",
      "fetchOptions",
      "FormSectionField",
      "getAssignableForms",
      "getAttachmentFields",
      "getAttachmentForms",
      "getAllForms",
      "getErrors",
      "getFields",
      "getFieldsWithNames",
      "getFieldsWithNamesForMinifyForm",
      "getFirstTab",
      "getFormNav",
      "getLoadingState",
      "getLocations",
      "getLookups",
      "getMiniFormFields",
      "getOption",
      "getOptionsAreLoading",
      "getRecordForms",
      "getRecordFormsByUniqueId",
      "getSelectedForm",
      "getServiceToRefer",
      "getSubformsDisplayName",
      "getValidationErrors",
      "reducer",
      "setSelectedForm"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
