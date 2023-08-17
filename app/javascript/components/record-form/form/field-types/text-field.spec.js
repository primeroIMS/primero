import { screen, mountedComponent, fireEvent } from "../../../../test-utils";
import { NUMERIC_FIELD } from "../../../form";
import { TEXT_FIELD_NAME } from "../constants";

import TextField from "./text-field";

describe("<TextField />", () => {
  describe("when is a normal text-field", () => {
    const props = {
      field: {
        name: "text_test",
        type: TEXT_FIELD_NAME,
        display_name_en: "Text test field"
      },
      formik: {
        values: []
      },
      label: "Test",
      mode: {
        isShow: false,
        isEdit: true
      },
      name: "text_test"
    };

    const formProps = {
      initialValues: {
        text_test: "test2"
      }
    };

    it("should render the TextField", () => {
      mountedComponent(<TextField {...props} />, {}, [], {}, formProps);
      expect(screen.getByTestId("text-field")).toBeInTheDocument();
    });

    it("should be empty if the value is null or undefined", () => {
      mountedComponent(<TextField {...props} />, {}, [], {}, formProps);
      const field = screen.getByTestId("text-field").querySelector("input");

      expect(field).toBeInTheDocument();
      fireEvent.change(field, { target: { value: "" } });
      expect(field.value).toBe("");
    });
  });

  describe("when is a numeric text-field", () => {
    const props = {
      field: {
        name: "test_number",
        type: NUMERIC_FIELD,
        display_name_en: "Number test field"
      },
      formik: {
        values: []
      },
      label: "Test Number",
      mode: {
        isShow: false,
        isEdit: true
      },
      name: "test_number"
    };

    const formProps = { initialValues: { test_number: "" } };

    it("should set the value as a number", () => {
      mountedComponent(<TextField {...props} />, {}, [], {}, formProps);
      const field = screen.getByTestId("text-field").querySelector("input");

      expect(field).toBeInTheDocument();
      fireEvent.change(field, { target: { value: 10 } });
      expect(field.value).toBe("10");
    });
  });

  describe("when is an age field", () => {
    const props = {
      field: {
        name: "age",
        type: NUMERIC_FIELD,
        display_name_en: "Age"
      },
      formik: {
        values: []
      },
      label: "Age",
      mode: {
        isShow: false,
        isEdit: true
      },
      name: "age"
    };

    describe("when a date of birth field is visible", () => {
      const formProps = { initialValues: { age: null } };
      const dobProps = { ...props, formSection: { fields: [{ name: "date_of_birth", visible: true }] } };

      it("should set the date of birth field", () => {
        mountedComponent(<TextField {...dobProps} />, {}, [], {}, formProps);
        const field = screen.getByTestId("text-field").querySelector("input");

        expect(field).toBeInTheDocument();
        fireEvent.change(field, { target: { value: 10 } });
        expect(field.value).toBe("10");
      });
    });

    describe("when a date of birth field is not visible", () => {
      const formProps = { initialValues: { age: null } };

      it("should not set the date of birth field", () => {
        mountedComponent(<TextField {...props} />, {}, [], {}, formProps);
        const field = screen.getByTestId("text-field").querySelector("input");

        expect(field).toBeInTheDocument();
        fireEvent.change(field, { target: { value: "10" } });
        expect(field.value).not.toBe("date_of_birth");
      });
    });
  });

  describe("when the text-field has hidden_text_field equals to true", () => {
    const props = {
      field: {
        name: "name",
        type: TEXT_FIELD_NAME,
        display_name_en: "Text test field",
        hidden_text_field: true
      },
      formik: {
        values: []
      },
      label: "Test",
      mode: {
        isShow: false,
        isEdit: true
      },
      recordType: "cases",
      name: "name"
    };

    const formProps = {
      initialValues: {
        name: "testname"
      }
    };

    it("should render the TextField", () => {
      mountedComponent(<TextField {...props} />, {}, ["/cases/1234abc/edit"], {}, formProps);
      expect(screen.getByTestId("text-field")).toBeInTheDocument();
    });

    it("should render the ButtonBase", () => {
      mountedComponent(<TextField {...props} />, {}, ["/cases/1234abc/edit"], {}, formProps);
      expect(screen.getByTestId("button-base")).toBeInTheDocument();
    });
  });
});
