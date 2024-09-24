import { DEFAULT_DATE_VALUES } from "../../../../config";
import { fireEvent, mountedComponent, screen, setScreenSizeToMobile, waitFor } from "../../../../test-utils";
import { DATE_FIELD } from "../../../form";
import { FieldRecord } from "../../records";

import DateField from "./date-field";

describe("<DateField />", () => {
  setScreenSizeToMobile(false);

  describe("when is date of birth field", () => {
    const props = {
      field: FieldRecord({
        name: "date_of_birth",
        type: DATE_FIELD,
        display_name_en: "Text test field"
      }),
      formik: {
        values: []
      },
      label: "Date of birth",
      mode: {
        isShow: false,
        isEdit: true
      },
      name: "date_of_birth"
    };

    describe.skip("and the age field is visible", () => {
      const formProps = { initialValues: { date_of_birth: null } };

      const ageProsp = { ...props, formSection: { fields: [{ name: "age", visible: true }] } };

      it("should set the age field", () => {
        mountedComponent(<DateField {...ageProsp} />, {}, [], {}, formProps);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });
    });

    describe.skip("and the age field is not visible", () => {
      const formProps = { initialValues: { date_of_birth: null } };

      it("should not set the age field", () => {
        mountedComponent(<DateField {...props} />, {}, [], {}, formProps);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });
    });
  });

  describe.skip("when is date field with a default value", () => {
    const props = {
      field: FieldRecord({
        name: "date_of_interview",
        type: DATE_FIELD,
        display_name_en: "Date of Interview",
        selected_value: DEFAULT_DATE_VALUES.TODAY
      }),
      formik: {
        values: []
      },
      label: "Date of Interview",
      name: "date_of_interview"
    };

    const formProps = { initialValues: {} };

    const modeProps = {
      ...props,
      mode: { isNew: true }
    };

    it("sets the date default value as string if the mode is new", () => {
      mountedComponent(<DateField {...modeProps} />, {}, [], {}, formProps);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("sets the datetime default value as string if the mode is new", () => {
      const newProps = {
        ...props,
        field: FieldRecord({
          name: "date_of_interview",
          type: DATE_FIELD,
          display_name_en: "Date of Interview",
          selected_value: DEFAULT_DATE_VALUES.TODAY,
          date_include_time: true
        }),
        mode: { isNew: true }
      };

      mountedComponent(<DateField {...newProps} />, {}, [], {}, formProps);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should clear the current value if the mode is new and the clear button is clicked", async () => {
      const clearProps = {
        ...props,
        mode: { isNew: true }
      };

      mountedComponent(<DateField {...clearProps} />, {}, [], {}, formProps);
      fireEvent.click(screen.getByRole("textbox"));
      await fireEvent.click(screen.getByText("buttons.clear").closest("button"));
      await waitFor(() => expect(screen.getByRole("textbox").value).toBe(""));
    });

    it("should not set the default value if the mode is not new", () => {
      const notNewProps = {
        ...props,
        mode: { isEdit: true }
      };

      mountedComponent(<DateField {...notNewProps} />, {}, [], {}, formProps);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });
});
