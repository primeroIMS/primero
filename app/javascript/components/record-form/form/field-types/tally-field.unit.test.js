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

  context("when autosum_total is true", () => {
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
    const tallyFieldComponent = setupMountedComponent(TallyField, newProps, {}, [], formProps).component;

    it("render 3 TextFields", () => {
      expect(tallyFieldComponent.find(TextField)).lengthOf(3);
    });

    it("render Total as a disabled TextField", () => {
      expect(tallyFieldComponent.find(TextField).last().find("label").text()).to.be.equal("fields.total");
      expect(tallyFieldComponent.find(TextField).last().props().disabled).to.be.true;
    });
  });
});
