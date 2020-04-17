import * as constants from "./constants";

describe("<Form /> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    expect(clonedConstants).to.be.an("object");
    [
      "CHECK_BOX_FIELD",
      "ERROR_FIELD",
      "FORM_MODE_DIALOG",
      "FORM_MODE_EDIT",
      "FORM_MODE_NEW",
      "FORM_MODE_SHOW",
      "PARENT_FORM",
      "PHOTO_FIELD",
      "SELECT_FIELD",
      "TEXT_AREA",
      "TEXT_FIELD",
      "TICK_FIELD"
    ].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
