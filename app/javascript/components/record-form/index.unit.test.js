import { expect } from "chai";

import * as index from "./index";

describe("<RecordForm /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "constructInitialValues",
      "default",
      "fetchForms",
      "fetchOptions",
      "FieldRecord",
      "FormSectionField",
      "getErrors",
      "getFirstTab",
      "getFormNav",
      "getLoadingState",
      "getLocations",
      "getOption",
      "getRecordForms",
      "getRecordFormsByUniqueId",
      "getSelectedForm",
      "reducers",
      "setSelectedForm",
      "getFormsByParentForm",
      "fetchLookups",
      "getLookups"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
