import * as index from "./index";

describe("<RecordForm /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "constructInitialValues",
      "default",
      "fetchAgencies",
      "fetchForms",
      "fetchLookups",
      "fetchOptions",
      "FieldRecord",
      "FormSectionField",
      "getAssignableForms",
      "getEnabledAgencies",
      "getErrors",
      "getFirstTab",
      "getFormNav",
      "getLoadingState",
      "getLocations",
      "getLookups",
      "getOption",
      "getOptionsAreLoading",
      "getRecordForms",
      "getRecordFormsByUniqueId",
      "getReportingLocations",
      "getSelectedForm",
      "reducer",
      "getServiceToRefer",
      "setSelectedForm"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
