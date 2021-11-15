import { FieldRecord } from "../records";
import { setupMockFieldComponent } from "../../../test";
import NepaliCalendar from "../../nepali-calendar-input";

import DateInput from "./date-input";

describe("<Form /> - fields/<DateInput />", () => {
  it("renders text input", () => {
    const { component } = setupMockFieldComponent(DateInput, FieldRecord);

    expect(component.exists("input[name='test_field_2']")).to.be.true;
  });

  it("renders help text", () => {
    const { component } = setupMockFieldComponent(DateInput, FieldRecord);

    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include("Test Field 2 help text");
  });

  it("renders errors", () => {
    const { component } = setupMockFieldComponent(DateInput, FieldRecord, {}, {}, {}, null, [
      {
        name: "test_field_2",
        message: "Name is required"
      }
    ]);

    expect(component.someWhere(n => n.find("Mui-error"))).to.be.true;
    expect(component.find("p.MuiFormHelperText-root").at(0).text()).to.include("Name is required");
  });

  describe("when ne locale", () => {
    it("renders Nepali date picker", () => {
      window.I18n.locale = "ne";

      const { component } = setupMockFieldComponent(DateInput, FieldRecord);

      expect(component.find(NepaliCalendar)).to.have.lengthOf(1);
    });

    after(() => {
      window.I18n.locale = "en";
    });
  });
});
