// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<RecordForm /> - index", () => {
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
