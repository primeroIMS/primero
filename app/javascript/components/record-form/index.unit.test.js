// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<RecordForm /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
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
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
