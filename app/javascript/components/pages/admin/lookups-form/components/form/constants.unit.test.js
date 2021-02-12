import * as constants from "./constants";

describe("<Form /> - components/form/constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    ["NAME", "TEMP_OPTION_ID", "FORM_ID"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
