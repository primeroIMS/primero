import React from "react";
import { expect } from "chai";
import { Formik, Form } from "formik";
import { FormControlLabel, Box } from "@material-ui/core";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";

import FormInternal from "./form-internal";
import ProvidedConsent from "./provided-consent";
import MainForm from "./main-form";
import {
  SERVICE_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD,
  NOTES_FIELD
} from "./constants";

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

  it("renders ProvidedConsent with valid props", () => {
    const providedConsentProps = { ...component.find(ProvidedConsent).props() };

    [
      "canConsentOverride",
      "providedConsent",
      "setDisabled",
      "recordType"
    ].forEach(property => {
      expect(providedConsentProps).to.have.property(property);
      delete providedConsentProps[property];
    });
    expect(providedConsentProps).to.be.empty;
  });

  it("renders FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.lengthOf(1);
  });

  it("renders FormInternal", () => {
    expect(component.find(FormInternal)).to.have.lengthOf(1);
  });

  describe("when mounting fields for FormInternal ", () => {
    const { component: mainFormComponent } = setupMountedComponent(
      FormikStub,
      props,
      initialState
    );

    const formInternalFields = [
      ...mainFormComponent.find(FormInternal).props().fields
    ];

    const textFieldProps = ["id", "label"];
    const searchableFieldProps = [...textFieldProps, "options", "onChange"];

    it("renders valid props for SERVICE_FIELD field", () => {
      const serviceFieldProps = {
        ...formInternalFields.find(
          formInternalField => formInternalField.id === SERVICE_FIELD
        )
      };

      searchableFieldProps.forEach(property => {
        expect(serviceFieldProps).to.have.property(property);
        delete serviceFieldProps[property];
      });

      expect(serviceFieldProps).to.be.empty;
    });

    it("renders valid props for AGENCY_FIELD field", () => {
      const agencyFieldProps = {
        ...formInternalFields.find(
          formInternalField => formInternalField.id === AGENCY_FIELD
        )
      };

      searchableFieldProps.forEach(property => {
        expect(agencyFieldProps).to.have.property(property);
        delete agencyFieldProps[property];
      });

      expect(agencyFieldProps).to.be.empty;
    });

    it("renders valid props for LOCATION_FIELD field", () => {
      const locationFieldProps = {
        ...formInternalFields.find(
          formInternalField => formInternalField.id === LOCATION_FIELD
        )
      };

      searchableFieldProps.forEach(property => {
        expect(locationFieldProps).to.have.property(property);
        delete locationFieldProps[property];
      });

      expect(locationFieldProps).to.be.empty;
    });

    it("renders valid props for TRANSITIONED_TO_FIELD field", () => {
      const transitionToFieldProps = {
        ...formInternalFields.find(
          formInternalField => formInternalField.id === TRANSITIONED_TO_FIELD
        )
      };

      [...searchableFieldProps, "required"].forEach(property => {
        expect(transitionToFieldProps).to.have.property(property);
        delete transitionToFieldProps[property];
      });

      expect(transitionToFieldProps).to.be.empty;
    });

    it("renders valid props for NOTES_FIELD field", () => {
      const transitionToFieldProps = {
        ...formInternalFields.find(
          formInternalField => formInternalField.id === NOTES_FIELD
        )
      };

      textFieldProps.forEach(property => {
        expect(transitionToFieldProps).to.have.property(property);
        delete transitionToFieldProps[property];
      });

      expect(transitionToFieldProps).to.be.empty;
    });
  });
});
