import { mountedComponent, screen } from "../../../../test-utils";

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
    it("should a DateTimePicker component", () => {
      mountedComponent(<DateFieldPicker {...props} />, {}, [], {}, formProps);
      expect(screen.getByTestId("date-time-picker")).toBeInTheDocument();
    });

    it("should render the correct helpText", () => {
      mountedComponent(<DateFieldPicker {...props} />, {}, [], {}, formProps);
      expect(screen.getByText("fields.date_help_with_time")).toBeInTheDocument();
    });
  });

  describe("when dateIncludeTime is false", () => {
    const dateIncludeProp = {
      ...props,
      dateIncludeTime: false
    };

    it("should a DatePicker component", () => {
      mountedComponent(<DateFieldPicker {...dateIncludeProp} />, {}, [], {}, formProps);
      expect(screen.getByTestId("date-picker")).toBeInTheDocument();
    });

    it("should render the correct helpText", () => {
      mountedComponent(<DateFieldPicker {...dateIncludeProp} />, {}, [], {}, formProps);
      expect(screen.getByText("fields.date_help")).toBeInTheDocument();
    });
  });

  describe("when ne locale", () => {
    it("renders Nepali date picker if locale ne", () => {
      global.I18n.locale = "ne";
      mountedComponent(<DateFieldPicker {...props} />, {}, [], {}, formProps);
      expect(screen.getByTestId("nepali-container")).toBeInTheDocument();
    });
  });
});
