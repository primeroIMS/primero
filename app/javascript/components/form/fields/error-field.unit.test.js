import React from "react";
import { FormProvider } from "react-hook-form";
import { fromJS } from "immutable";
import Alert from "@material-ui/lab/Alert";

import { setupMockFieldComponent } from "../../../test";
import { FieldRecord } from "../records";

import ErrorField from "./error-field";

describe("<Form /> - fields/<ErrorField />", () => {
  it("renders a error field if there are errors in the forms", () => {
    const { component } = setupMockFieldComponent(
      () => (
        <FormProvider errors={{ name: "test" }} formMode={fromJS({})}>
          <ErrorField errorsToCheck={fromJS(["name"])} />
        </FormProvider>
      ),
      FieldRecord
    );

    expect(component.find(Alert)).to.have.lengthOf(1);
  });

  it("does not render the error field if the form doesn't have errors", () => {
    const { component } = setupMockFieldComponent(
      () => (
        <FormProvider formMode={fromJS({})}>
          <ErrorField errorsToCheck={fromJS(["name"])} />
        </FormProvider>
      ),
      FieldRecord
    );

    expect(component.find(Alert)).to.be.empty;
  });
});
