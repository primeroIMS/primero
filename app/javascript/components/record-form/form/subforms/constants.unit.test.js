import { expect } from "../../../../test";

import {
  SUBFORM_LOOKUP_HEADER_NAME,
  SUBFORM_DATE_HEADER_NAME,
  SUBFORM_HEADER_DATE,
  SUBFORM_HEADER,
  SUBFORM_FIELDS,
  SUBFORM_FIELD_ARRAY,
  SUBFORM_DIALOG
} from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = {
      SUBFORM_LOOKUP_HEADER_NAME,
      SUBFORM_DATE_HEADER_NAME,
      SUBFORM_HEADER_DATE,
      SUBFORM_HEADER,
      SUBFORM_FIELDS,
      SUBFORM_FIELD_ARRAY,
      SUBFORM_DIALOG
    };

    [
      "SUBFORM_LOOKUP_HEADER_NAME",
      "SUBFORM_DATE_HEADER_NAME",
      "SUBFORM_HEADER_DATE",
      "SUBFORM_HEADER",
      "SUBFORM_FIELDS",
      "SUBFORM_FIELD_ARRAY",
      "SUBFORM_DIALOG"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
