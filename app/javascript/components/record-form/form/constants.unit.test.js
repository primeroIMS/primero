import * as formConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...formConstants };

    [
      "ATTACHMENT_FIELD_NAME",
      "DATE_FIELD_NAME",
      "DOCUMENT_FIELD_NAME",
      "FORM_SECTION_FIELD_NAME",
      "RADIO_FIELD_NAME",
      "RECORD_FORM_TOOLBAR_NAME",
      "RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME",
      "RECORD_FORM_NAME",
      "SELECT_FIELD_NAME",
      "SEPERATOR_NAME",
      "TEXT_FIELD_NAME",
      "TICK_FIELD_NAME"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.deep.equal({});
  });
});
