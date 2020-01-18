import { FieldRecord } from "../records";
import { expect, setupMockFieldComponent } from "../../../test";
import { TEXT_AREA } from "../constants";

import TextInput from "./text-input";

describe("<Form /> - fields/<TextInput />", () => {
  it("renders text input", () => {
    const { component } = setupMockFieldComponent(TextInput, FieldRecord);

    expect(component.exists("input[name='test_field_2']")).to.be.true;
  });

  it("renders textarea", () => {
    const { component } = setupMockFieldComponent(
      TextInput,
      FieldRecord,
      {},
      {},
      { type: TEXT_AREA }
    );

    expect(component.exists("textarea[name='test_field_2']")).to.be.true;
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(TextInput, FieldRecord);

    expect(
      component
        .find("p.MuiFormHelperText-root")
        .at(0)
        .text()
    ).to.include("Test Field 2 help text");
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(TextInput, FieldRecord);

    component
      .find("FormContext")
      .props()
      .setError("test_field_2", "required", "Name is required");
    
    expect(component.someWhere(n => n.find("Mui-error"))).to.be.true;
    expect(
      component
        .find("p.MuiFormHelperText-root")
        .at(0)
        .text()
    ).to.include("Name is required");
  });

  it("renders required indicator", () => {
    const { component } = setupMockFieldComponent(TextInput, FieldRecord);

    expect(
      component
        .find("span")
        .at(0)
        .text()
    ).to.include("*");
  });

  it("should autoFocus when prop set", () => {
    const { component } = setupMockFieldComponent(TextInput, FieldRecord);

    expect(component.find("input").props().autoFocus).to.be.true;
  });
});
