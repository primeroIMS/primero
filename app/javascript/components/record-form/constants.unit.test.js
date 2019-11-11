import { expect } from "chai";

import * as recordConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...recordConstants };

    expect(constants).to.have.property("TEXT_FIELD");
    expect(constants).to.have.property("NUMERIC_FIELD");
    expect(constants).to.have.property("SUBFORM_SECTION");
    expect(constants).to.have.property("TEXT_AREA");
    expect(constants).to.have.property("DATE_FIELD");
    expect(constants).to.have.property("SELECT_FIELD");
    expect(constants).to.have.property("TICK_FIELD");
    expect(constants).to.have.property("SEPERATOR");
    expect(constants).to.have.property("RADIO_FIELD");
    expect(constants).to.have.property("PHOTO_FIELD");
    expect(constants).to.have.property("DOCUMENT_FIELD");
    expect(constants).to.have.property("AUDIO_FIELD");
    expect(constants).to.have.property("NAME_FIELD");

    delete constants.TEXT_FIELD;
    delete constants.NUMERIC_FIELD;
    delete constants.SUBFORM_SECTION;
    delete constants.TEXT_AREA;
    delete constants.DATE_FIELD;
    delete constants.SELECT_FIELD;
    delete constants.TICK_FIELD;
    delete constants.SEPERATOR;
    delete constants.RADIO_FIELD;
    delete constants.PHOTO_FIELD;
    delete constants.DOCUMENT_FIELD;
    delete constants.AUDIO_FIELD;
    delete constants.NAME_FIELD;

    expect(constants).to.deep.equal({});
  });
});