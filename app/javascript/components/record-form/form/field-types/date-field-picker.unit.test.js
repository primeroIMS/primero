import { DatePicker, DateTimePicker } from "@material-ui/pickers";

import { setupMountedComponent } from "../../../../test";

import DateFieldPicker from "./date-field-picker";

describe("<DateFieldPicker />", () => {
  const formProps = {
    initialValues: {
      date_field_picker: ""
    }
  };

  const props = {
    dateIncludeTime: true,
    dateProps: {},
    displayName: { en: "Date Test" },
    fieldTouched: false,
    fieldError: "",
    helperText: ""
  };

  describe("when dateIncludeTime is true", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(DateFieldPicker, props, {}, [], formProps));
    });

    it("should a DateTimePicker component", () => {
      expect(component.find(DateTimePicker)).lengthOf(1);
    });

    it("should render the correct helpText", () => {
      expect(component.find(DateTimePicker).props().helperText).to.be.equal("fields.date_help_with_time");
    });
  });

  describe("when dateIncludeTime is false", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(DateFieldPicker, { ...props, dateIncludeTime: false }, {}, [], formProps));
    });

    it("should a DatePicker component", () => {
      expect(component.find(DatePicker)).lengthOf(1);
    });

    it("should render the correct helpText", () => {
      expect(component.find(DatePicker).props().helperText).to.be.equal("fields.date_help");
    });
  });
});
