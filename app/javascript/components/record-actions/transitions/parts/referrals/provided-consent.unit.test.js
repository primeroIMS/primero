/* eslint-disable no-unused-expressions */
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import ProvidedForm from "./provided-form";
import ProvidedConsent from "./provided-consent";

describe("<ProvidedConsent /> - referrals", () => {
  const formProps = {
    initialValues: {
      transfer: false
    }
  };
  it("should not render anything when child has provided consent", () => {
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

  it("should render <ProvidedForm> when child has not provided consent", () => {
    const props = {
      canConsentOverride: true,
      providedConsent: false,
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
