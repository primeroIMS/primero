import { expect } from "../../test";

import * as index from "./index";

describe("<Form /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "default",
      "FieldRecord",
      "FormSectionRecord",
      "FormAction",
      "FORM_MODE_DIALOG",
      "TICK_FIELD",
      "TEXT_FIELD",
      "CHECK_BOX_FIELD",
      "SELECT_FIELD",
      "TEXT_AREA",
      "PHOTO_FIELD",
      "ERROR_FIELD",
      "whichFormMode"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
