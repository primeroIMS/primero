import { Radio } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
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
        { id: "test2", display_text: "Test 2" }
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
      radio_test: ""
    }
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(RadioField, props, {}, [], formProps));
  });

  it("render the RadioField", () => {
    expect(component.find(RadioField)).lengthOf(1);
    expect(component.find(Radio)).lengthOf(2);
  });
});
