/* eslint-disable no-unused-expressions */
import React from "react";
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Form, Formik } from "formik";
import ProvidedForm from "./provided-form";
import ProvidedConsent from "./provided-consent";

const ProvidedConsentForm = props => {
  const formProps = {
    initialValues: {
      referral: false
    }
  };
  return (
    <Formik {...formProps}>
      <Form>
        <ProvidedConsent {...props} />
      </Form>
    </Formik>
  );
};

describe("<ProvidedConsent />", () => {
  let component;
  describe("when child has provided consent", () => {
    const props = {
      canConsentOverride: false,
      providedConsent: true,
      setDisabled: () => {}
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(ProvidedConsentForm, props));
    });

    it("should not render anything", () => {
      expect(component).to.be.empty;
    });
  });

  describe("when child has not provided consent", () => {
    const props = {
      canConsentOverride: true,
      providedConsent: false,
      setDisabled: () => {}
    };
    beforeEach(() => {
      ({ component } = setupMountedComponent(ProvidedConsentForm, props));
    });
    describe("with not provided consent given", () => {
      it("renders <ProvidedForm>", () => {
        expect(component.find(ProvidedForm)).to.have.lengthOf(1);
      });
    });
  });
});
