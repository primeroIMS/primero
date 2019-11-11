
import { expect } from "chai";
import { setupMountedComponent } from "../../../../../test";
import ProvidedForm from "./provided-form";
import ProvidedConsent from "./provided-consent";

describe("<ProvidedConsent /> - transfers", () => {
  const formProps = {
    initialValues: {
      transfer: false
    }
  };
  it("should not render anything when child has provided consent and user can't consent override", () => {
    const props = {
      canConsentOverride: false,
      providedConsent: true
    };
    const { component } = setupMountedComponent(
      ProvidedConsent,
      props,
      {},
      [],
      formProps
    );
    expect(component).to.be.empty;
  });

  it("should not render anything when child has provided consent and user can consent override", () => {
    const props = {
      canConsentOverride: true,
      providedConsent: true
    };
    const { component } = setupMountedComponent(
      ProvidedConsent,
      props,
      {},
      [],
      formProps
    );
    expect(component).to.be.empty;
  });

  it("should render <ProvidedForm> when child has not provided consent and user can consent override", () => {
    const props = {
      canConsentOverride: true,
      providedConsent: false
    };
    const { component } = setupMountedComponent(
      ProvidedConsent,
      props,
      {},
      [],
      formProps
    );
    expect(component.find(ProvidedForm)).to.have.lengthOf(1);
  });

  it("should render <ProvidedForm> when child has not provided consent and user can't consent override", () => {
    const props = {
      canConsentOverride: false,
      providedConsent: false
    };
    const { component } = setupMountedComponent(
      ProvidedConsent,
      props,
      {},
      [],
      formProps
    );
    expect(component.find(ProvidedForm)).to.have.lengthOf(1);
  });
});
