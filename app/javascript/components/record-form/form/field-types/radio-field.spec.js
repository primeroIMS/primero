// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";
import { RADIO_FIELD } from "../../constants";

import RadioField from "./radio-field";

describe("<RadioField />", () => {
  const props = {
    field: {
      name: "radio_test",
      type: RADIO_FIELD,
      display_name_en: "Radio test field",
      option_strings_text: [
        { id: "test1", display_text: "Test 1" },
        { id: "test2", disabled: true, display_text: "Test 2" },
        { id: "test3", display_text: "Test 3" },
        { id: "test4", disabled: true, display_text: "Test 4" }
      ]
    },
    formik: {
      values: []
    },
    label: "Test",
    mode: {
      isShow: false,
      isEdit: true
    },
    name: "radio_test"
  };

  const formProps = {
    initialValues: {
      radio_test: "test2"
    }
  };

  it("render the RadioField", () => {
    mountedComponent(<RadioField {...props} />, {}, [], {}, formProps);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("render two Radio enabled and one disabled", () => {
    mountedComponent(<RadioField {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByRole("radio").at(0)).not.toBeDisabled();
    expect(screen.getAllByRole("radio").at(1)).toBeDisabled();
    expect(screen.getAllByRole("radio").at(2)).not.toBeDisabled();
  });

  describe("when a the field doesn't have value", () => {
    const newProps = {
      ...props,
      field: {
        name: "consent_reporting",
        type: RADIO_FIELD,
        display_name_en: "Radio test field",
        option_strings_text: [
          { id: "true", display_text: { en: "Yes" } },
          { id: "false", display_text: { en: "No" } }
        ]
      },
      formik: {
        values: {
          consent_reporting: null
        }
      },
      name: "consent_reporting"
    };

    const newFormProps = {
      initialValues: {
        consent_reporting: null
      }
    };

    it("render the select field with options included the disabled selected", () => {
      mountedComponent(<RadioField {...newProps} />, {}, [], {}, newFormProps);
      expect(screen.getAllByRole("radio")).toHaveLength(2);
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(screen.getByText("No")).toBeInTheDocument();
    });
  });
});
