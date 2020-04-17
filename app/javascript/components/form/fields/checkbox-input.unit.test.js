import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";

import CheckboxInput from "./checkbox-input";

describe("<Form /> - fields/<SelectInput />", () => {
  const options = [
    { id: 1, display_text: "option-1" },
    { id: 2, display_text: "option-2" }
  ];

  it("renders checkbox inputs", () => {
    const { component } = setupMockFieldComponent(
      CheckboxInput,
      FieldRecord,
      {},
      { options }
    );

    expect(component.find("input")).to.be.lengthOf(2);
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(CheckboxInput, FieldRecord);

    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include(
      "Test Field 2 help text"
    );
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(CheckboxInput, FieldRecord);

    component
      .find("FormContext")
      .props()
      .setError("test_field_2", "required", "Name is required");

    expect(component.someWhere(n => n.find("Mui-error"))).to.be.true;
    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include(
      "Name is required"
    );
  });

  it("renders required indicator", () => {
    const { component } = setupMockFieldComponent(CheckboxInput, FieldRecord);

    expect(component.find("span").at(0).text()).to.include("*");
  });
});
