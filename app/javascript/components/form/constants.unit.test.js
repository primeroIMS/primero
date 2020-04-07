import { expect } from "../../test/unit-test-helpers";

import * as constants from "./constants";

describe("<Form /> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    expect(clonedConstants).to.be.an("object");
    [
      "TEXT_FIELD",
      "TEXT_AREA",
      "FORM_MODE_SHOW",
      "FORM_MODE_EDIT",
      "FORM_MODE_NEW",
      "FORM_MODE_DIALOG",
      "SELECT_FIELD",
      "TICK_FIELD",
      "CHECK_BOX_FIELD",
      "PHOTO_FIELD",
      "ERROR_FIELD"
    ].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
