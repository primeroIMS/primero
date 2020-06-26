import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";

import DateInput from "./text-input";

describe("<Form /> - fields/<DateInput />", () => {
  it("renders text input", () => {
    const { component } = setupMockFieldComponent(DateInput, FieldRecord);

    expect(component.exists("input[name='test_field_2']")).to.be.true;
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(DateInput, FieldRecord);

    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include(
      "Test Field 2 help text"
    );
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(DateInput, FieldRecord);

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
