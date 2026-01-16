import { mountedComponent, screen } from "../../../../test-utils";
import { TALLY_FIELD_NAME } from "../constants";

import TallyField from "./tally-field";

describe("<FormSectionField />", () => {
  const props = {
    name: "Test",
    field: {
      type: TALLY_FIELD_NAME,
      display_name: { en: "Test" },
      helperText: "This is a help text",
      disabled: false,
      tally: [
        { id: "test1", display_text: { en: "Test 1" } },
        { id: "test2", display_text: { en: "Test 2" } }
      ]
    },
    formik: {
      values: [],
      setFieldValue: () => {},
      registerField: () => {}
    },
    mode: {
      isShow: true
    },
    formSection: {}
  };

  const formProps = {
    initialValues: {
      radio_test: "test2"
    }
  };

  it("render a TallyField", () => {
    mountedComponent(<TallyField {...props} />, {}, [], {}, formProps);
    expect(screen.getByTestId("tally-field")).toBeInTheDocument();
  });

  it("render a TextFields", () => {
    mountedComponent(<TallyField {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
  });

  describe("when autosum_total is true", () => {
    const newProps = {
      ...props,
      field: {
        type: TALLY_FIELD_NAME,
        display_name: { en: "Test2" },
        helperText: "This is a help text 2",
        disabled: false,
        autosum_total: true,
        tally: [
          { id: "test1", display_text: { en: "Test 1" } },
          { id: "test2", display_text: { en: "Test 2" } }
        ]
      }
    };

    it("render 3 TextFields", () => {
      mountedComponent(<TallyField {...newProps} />, {}, [], {}, formProps);
      expect(screen.getAllByRole("spinbutton")).toHaveLength(3);
    });

    it("render Total as a disabled TextField", () => {
      mountedComponent(<TallyField {...newProps} />, {}, [], {}, formProps);
      expect(screen.getByLabelText("fields.total")).toHaveClass("Mui-disabled");
    });
  });

  describe("when the field has an error", () => {
    it("does not render an error if the field was not touched", () => {
      mountedComponent(
        <TallyField {...props} />,
        {},
        [],
        {},
        {
          ...formProps,
          initialErrors: { Test: "field required" }
        }
      );
      expect(screen.queryByText("field required")).not.toBeInTheDocument();
    });

    it("renders an error if the field was touched", () => {
      mountedComponent(
        <TallyField {...props} />,
        {},
        [],
        {},
        {
          ...formProps,
          initialErrors: { Test: "field required" },
          initialTouched: { Test: true }
        }
      );
      expect(screen.getByText("field required")).toBeInTheDocument();
    });
  });
  describe("Total calculation", () => {
    it("sets null (empty) when values are empty", async () => {
      const tallyFormProps = {
        initialValues: {
          Test: { test1: null, test2: "" }
        }
      };

      const testProps = {
        ...props,
        mode: { isShow: false },
        field: {
          ...props.field,
          autosum_total: true,
          display_name: { en: "Test" },
          tally: [
            { id: "test1", display_text: { en: "Test 1" } },
            { id: "test2", display_text: { en: "Test 2" } }
          ]
        },
        formik: {
          setFieldValue: () => {},
          registerField: () => {}
        },
        formSection: {}
      };

      mountedComponent(<TallyField {...testProps} />, {}, [], {}, tallyFormProps);

      const totalField = await screen.findByLabelText("fields.total");

      expect(totalField).toHaveValue(null);
    });

    it("sets sum when values are present", async () => {
      const tallyFormProps = {
        initialValues: {
          Test: { test1: 5, test2: 10 }
        }
      };

      const testProps = {
        ...props,
        mode: { isShow: false },
        field: {
          ...props.field,
          autosum_total: true,
          display_name: { en: "Test" },
          tally: [
            { id: "test1", display_text: { en: "Test 1" } },
            { id: "test2", display_text: { en: "Test 2" } }
          ]
        },
        formik: {
          setFieldValue: () => {},
          registerField: () => {}
        },
        formSection: {}
      };

      mountedComponent(<TallyField {...testProps} />, {}, [], {}, tallyFormProps);

      const totalField = await screen.findByLabelText("fields.total");

      expect(totalField).toHaveValue(15);
    });
  });
});
