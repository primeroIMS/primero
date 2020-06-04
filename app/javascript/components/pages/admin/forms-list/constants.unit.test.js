import * as constants from "./constants";

describe("<FormList /> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    [
      "DRAGGING_COLOR",
      "DRAGGING_IDLE_COLOR",
      "FORM_GROUP_PREFIX",
      "NAME",
      "ORDER_STEP",
      "ORDER_TYPE"
    ].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });

  it("should have known properties for ORDER_TYPE", () => {
    const clonedConstants = { ...constants.ORDER_TYPE };

    ["formSection", "formGroup"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
