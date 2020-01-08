import { expect } from "chai";

import * as index from "./index";

describe("<RecordForm /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "default",
      "setSelectedForm",
      "fetchForms",
      "fetchOptions",
      "reducers",
      "getFirstTab",
      "getFormNav",
      "getRecordForms",
      "getOption",
      "getLoadingState",
      "getErrors",
      "getSelectedForm",
      "getRecordFormsByUniqueId",
      "FormSectionField",
      "FieldRecord",
      "constructInitialValues"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
