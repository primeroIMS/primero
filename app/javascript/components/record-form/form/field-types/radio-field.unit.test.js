import { FormControlLabel, Radio } from "@material-ui/core";

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

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(RadioField, props, {}, [], formProps));
  });

  it("render the RadioField", () => {
    expect(component.find(RadioField)).lengthOf(1);
    expect(component.find(Radio)).lengthOf(3);
  });
  it("render two Radio enabled and one disabled", () => {
    const radiosRendered = component.find(Radio);

    expect(radiosRendered.at(0).props().disabled).to.be.false;
    expect(radiosRendered.at(1).props().disabled).to.be.true;
    expect(radiosRendered.at(2).props().disabled).to.be.false;
  });

  context("when a the field doesn't have value", () => {
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

    const radioComponent = setupMountedComponent(RadioField, newProps, {}, [], newFormProps).component;

    it("render the select field with options included the disabled selected", () => {
      const radiosRendered = radioComponent.find(FormControlLabel);

      expect(radiosRendered).lengthOf(2);
      expect(radioComponent.find(Radio)).lengthOf(2);
      expect(radiosRendered.at(0).text()).to.be.equal("Yes");
      expect(radiosRendered.at(1).text()).to.be.equal("No");
    });
  });
});
