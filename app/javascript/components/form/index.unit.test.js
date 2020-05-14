import * as index from "./index";

describe("<Form /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "ActionsMenu",
      "CHECK_BOX_FIELD",
      "default",
      "ERROR_FIELD",
      "FORM_MODE_DIALOG",
      "FieldRecord",
      "FormAction",
      "FormSectionRecord",
      "LABEL_FIELD",
      "PARENT_FORM",
      "PHOTO_FIELD",
      "SELECT_FIELD",
      "submitHandler",
      "TEXT_AREA",
      "TEXT_FIELD",
      "TICK_FIELD",
      "whichFormMode"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
