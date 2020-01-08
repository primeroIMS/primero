import { expect } from "chai";

import * as formConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...formConstants };

    expect(constants).to.have.property("ATTACHMENT_FIELD_NAME");
    expect(constants).to.have.property("DATE_FIELD_NAME");
    expect(constants).to.have.property("DOCUMENT_FIELD_NAME");
    expect(constants).to.have.property("FORM_SECTION_FIELD_NAME");
    expect(constants).to.have.property("RADIO_FIELD_NAME");
    expect(constants).to.have.property("RECORD_FORM_TOOLBAR_NAME");
    expect(constants).to.have.property("RECORD_FORM_NAME");
    expect(constants).to.have.property("SELECT_FIELD_NAME");
    expect(constants).to.have.property("SEPERATOR_NAME");
    expect(constants).to.have.property("TEXT_FIELD_NAME");
    expect(constants).to.have.property("TICK_FIELD_NAME");

    delete constants.ATTACHMENT_FIELD_NAME;
    delete constants.DATE_FIELD_NAME;
    delete constants.DOCUMENT_FIELD_NAME;
    delete constants.FORM_SECTION_FIELD_NAME;
    delete constants.RADIO_FIELD_NAME;
    delete constants.RECORD_FORM_TOOLBAR_NAME;
    delete constants.RECORD_FORM_NAME;
    delete constants.SELECT_FIELD_NAME;
    delete constants.SEPERATOR_NAME;
    delete constants.TEXT_FIELD_NAME;
    delete constants.TICK_FIELD_NAME;

    expect(constants).to.deep.equal({});
  });
});
