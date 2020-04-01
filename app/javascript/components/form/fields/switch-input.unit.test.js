import { FieldRecord } from "../records";
import { expect, setupMockFieldComponent } from "../../../test";

import SwitchInput from "./switch-input";

describe("<Form /> - fields/<SwitchInput />", () => {
  it("renders switch input", () => {
    const { component } = setupMockFieldComponent(SwitchInput, FieldRecord);

    expect(component.exists("input[name='test_field_2']")).to.be.true;
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(SwitchInput, FieldRecord);

    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include(
      "Test Field 2 help text"
    );
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(SwitchInput, FieldRecord);

    component
      .find("FormContext")
      .props()
      .setError("test_field_2", "required", "Name is required");

    expect(component.someWhere(n => n.find("Mui-error"))).to.be.true;
    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include(
      "Name is required"
    );
  });
});
