import * as recordConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...recordConstants };

    [
      "AUDIO_FIELD",
      "DATE_FIELD",
      "DOCUMENT_FIELD",
      "NAME",
      "NAME_FIELD",
      "NUMERIC_FIELD",
      "PHOTO_FIELD",
      "RADIO_FIELD",
      "SELECT_FIELD",
      "SEPERATOR",
      "SUBFORM_SECTION",
      "TEXT_AREA",
      "TEXT_FIELD",
      "TICK_FIELD",
      "URL_LOOKUPS"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
