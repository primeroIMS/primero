import React from "react";
import Alert from "@material-ui/lab/Alert";
import { FormContext } from "react-hook-form";
import { fromJS } from "immutable";

import { setupMockFormComponent } from "../../../test";
import { FieldRecord } from "../records";

import FormSectionField from "./form-section-field";

describe("<Form /> - components/<FormSectionField />", () => {
  it("renders a text field", () => {
    const field = FieldRecord({ name: "test_field", type: "text_field" });
    const { component } = setupMockFormComponent(FormSectionField, { field });

    expect(component.exists("input[name='test_field']")).to.be.true;
  });

  it("renders a textarea field", () => {
    const field = FieldRecord({ name: "test_field", type: "textarea" });
    const { component } = setupMockFormComponent(FormSectionField, { field });

    expect(component.exists("textarea[name='test_field']")).to.be.true;
  });

  it("renders an error field", () => {
    const field = FieldRecord({ name: "test_field", type: "error_field" });
    const { component } = setupMockFormComponent(() => (
      <FormContext errors={{ name: "test" }} formMode={fromJS({})}>
        <FormSectionField field={field} checkErrors={fromJS(["name"])} />
      </FormContext>
    ));

    expect(component.find(Alert)).to.have.lengthOf(1);
  });

  it("does not render an error field", () => {
    const field = FieldRecord({ name: "test_field", type: "error_field" });
    const { component } = setupMockFormComponent(() => (
      <FormContext formMode={fromJS({})}>
        <FormSectionField field={field} checkErrors={fromJS(["name"])} />
      </FormContext>
    ));

    expect(component.find(Alert)).to.be.empty;
  });
});
