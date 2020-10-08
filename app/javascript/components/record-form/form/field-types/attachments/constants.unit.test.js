import * as constants from "./constants";

describe("record-form/form/field-types/attachments/constants", () => {
  describe("constants", () => {
    let clone;

    before(() => {
      clone = { ...constants };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "ATTACHMENT_FIELDS",
      "ATTACHMENT_FIELDS_INITIAL_VALUES",
      "ATTACHMENT_TYPES",
      "FIELD_ATTACHMENT_TYPES",
      "ATTACHMENT_ACCEPTED_TYPES"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
