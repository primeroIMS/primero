import { TextField } from "formik-material-ui";

import { setupMountedComponent } from "../../../../test";
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

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(TallyField, props, {}, [], formProps));
  });

  it("render a TallyField", () => {
    expect(component.find(TallyField)).lengthOf(1);
  });

  it("render a TextFields", () => {
    expect(component.find(TextField)).lengthOf(2);
  });
});
