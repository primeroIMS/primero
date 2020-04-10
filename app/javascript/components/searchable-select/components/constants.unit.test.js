import * as constantsParts from "./constants";

describe("<SearchableSelect /> - Parts - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...constantsParts };

    [
      "CONTROL_NAME",
      "CUSTOM_AUTOCOMPLETE_NAME",
      "INPUT_NAME",
      "MENU_NAME",
      "MULTI_VALUE_NAME",
      "NO_OPTIONS_MESSAGE_NAME",
      "OPTION_NAME",
      "PLACEHOLDER_NAME",
      "SINGLE_VALUE_NAME",
      "VALUE_CONTAINER_NAME"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
