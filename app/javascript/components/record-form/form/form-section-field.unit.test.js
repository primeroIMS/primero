// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setupMountedComponent } from "../../../test";
import { SELECT_FIELD } from "../constants";

import FormSectionField from "./form-section-field";
import SelectField from "./field-types/select-field";
import { TEXT_FIELD_NAME } from "./constants";

describe("<FormSectionField />", () => {
  const props = {
    name: "Test",
    isReadWriteForm: false,
    field: {
      type: TEXT_FIELD_NAME,
      display_name: { en: "Test" },
      disabled: false
    },
    mode: {
      isShow: true
    },
    formSection: {}
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormSectionField, props));
  });

  it("render a FormSectionField", () => {
    expect(component.find(FormSectionField)).lengthOf(1);
  });

  describe("When is select field", () => {
    const selectFieldProps = {
      name: "Test",
      field: {
        type: SELECT_FIELD,
        display_name: { en: "Test" },
        disabled: false,
        visible: true,
        options: [{ id: 1, display_text: "test" }]
      },
      mode: {
        isEdit: true,
        isShow: false
      },
      isReadWriteForm: true
    };

    context("and violationOptions is present ", () => {
      const violationOptions = [{ id: 2, display_text: "test2" }];
      const { component: componentToEvaluate } = setupMountedComponent(
        FormSectionField,
        { ...selectFieldProps, violationOptions },
        {},
        [],
        { registerField: () => {} }
      );

      it("should pass it has options for select", () => {
        expect(componentToEvaluate.find(SelectField).props().optionsSelector().options).to.deep.equal(violationOptions);
      });
    });

    context("and violationOptions is NOT present ", () => {
      const { component: componentToEvaluate } = setupMountedComponent(
        FormSectionField,
        { ...selectFieldProps },
        {},
        [],
        { registerField: () => {} }
      );

      it("should pass it has options for select", () => {
        expect(componentToEvaluate.find(SelectField).props().optionsSelector().options).to.deep.equal([
          { id: 1, display_text: "test" }
        ]);
      });
    });
  });
});
