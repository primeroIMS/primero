import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";

import SwitchInput from "./switch-input";

describe("<Form /> - fields/<SwitchInput />", () => {
  it("renders switch input", () => {
    const { component } = setupMockFieldComponent(SwitchInput, FieldRecord);

    expect(component.exists("input")).to.be.true;
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(SwitchInput, FieldRecord);

    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include("Test Field 2 help text");
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(SwitchInput, FieldRecord, {}, {}, {}, null, [
      {
        name: "test_field_2",
        message: "Name is required"
      }
    ]);

    expect(component.someWhere(n => n.find("Mui-error"))).to.be.true;
    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include("Name is required");
  });
});
