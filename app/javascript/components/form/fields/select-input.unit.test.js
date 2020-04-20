import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";

import SelectInput from "./select-input";

describe("<Form /> - fields/<SelectInput />", () => {
  const options = [
    { id: 1, display_text: "option-1" },
    { id: 2, display_text: "option-2" }
  ];

  it("renders select input", () => {
    const { component } = setupMockFieldComponent(
      SelectInput,
      FieldRecord,
      {},
      { options }
    );

    expect(component.exists("div[name='test_field_2']")).to.be.true;
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord);

    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include(
      "Test Field 2 help text"
    );
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord);

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
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord);

    expect(component.find("span").at(0).text()).to.include("*");
  });

  it("should autoFocus when prop set", () => {
    const { component } = setupMockFieldComponent(SelectInput, FieldRecord);

    expect(component.find("input").props().autoFocus).to.be.true;
  });
});
