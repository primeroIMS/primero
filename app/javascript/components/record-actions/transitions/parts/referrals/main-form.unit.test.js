import React from "react";
import { expect } from "chai";
import { Formik, Form } from "formik";
import { FormControlLabel, Box } from "@material-ui/core";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";

import FormInternal from "./form-internal";
import ProvidedConsent from "./provided-consent";
import MainForm from "./main-form";
import Actions from "./actions";

const FormikStub = props => {
  const { formProps } = props;

  return <Formik {...formProps} />;
};

describe("<MainForm />", () => {
  let component;
  const initialState = fromJS({
    records: {
      transitions: {
        referral: {
          errors: [],
          users: [{ id: 1, user_name: "primero" }]
        }
      }
    },
    application: {
      agencies: [{ unique_id: "agency-unicef", name: "UNICEF" }]
    },
    forms: {
      options: [
        {
          type: "lookup-service-type",
          options: [{ id: "health", display_text: "Health" }]
        },
        {
          type: "reporting_location",
          options: [{ id: "location_a", display_text: "Location A" }]
        }
      ]
    }
  });
  const mainFormProps = {
    canConsentOverride: false,
    disabled: false,
    handleClose: () => {},
    providedConsent: true,
    recordType: "cases",
    setDisabled: () => {}
  };
  const props = {
    formProps: {
      initialValues: {
        agency: "",
        location: "",
        notes: "",
        referral: false,
        remoteSystem: false,
        services: "",
        transitioned_to: ""
      },
      handleSubmit: () => {},
      render: p => <MainForm formProps={p} rest={mainFormProps} />
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormikStub, props, initialState));
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("renders ProvidedConsent", () => {
    expect(component.find(ProvidedConsent)).to.have.lengthOf(1);
  });

  it("renders FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.lengthOf(1);
  });

  it("renders FormInternal", () => {
    expect(component.find(FormInternal)).to.have.lengthOf(1);
  });

  it("renders Box", () => {
    expect(component.find(Box)).to.have.lengthOf(1);
  });

  it("renders Actions with two props", () => {
    const referActions = component.find(Actions);
    const referActionsProps = referActions.props();

    expect(referActions).to.have.lengthOf(1);
    expect(referActionsProps).to.have.property("handleClose");
    expect(referActionsProps.handleClose).to.be.a("function");
    expect(referActionsProps).to.have.property("disabled");
    expect(referActionsProps.disabled).to.be.a("boolean");
    delete referActionsProps.handleClose;
    delete referActionsProps.disabled;

    expect(referActionsProps).to.be.empty;
  });
});
