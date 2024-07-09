/* eslint-disable no-unused-expressions */
import { mountedComponent, screen } from "../../../../../test-utils";

import ProvidedConsent from "./provided-consent";

describe("<ProvidedConsent /> - referrals", () => {
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

    mountedComponent(<ProvidedConsent {...props} />, {}, [], [], [], formProps);

    expect(screen.queryByText(/referral.provided_consent_label/i)).toBeNull();
  });

  it("should not render anything when child has provided consent and user can consent override", () => {
    const props = {
      canConsentOverride: true,
      providedConsent: true
    };

    mountedComponent(<ProvidedConsent {...props} />, {}, [], [], [], formProps);

    expect(screen.queryByText(/referral.provided_consent_label/i)).toBeNull();
  });

  it("should render <ProvidedForm> when child has not provided consent and user can consent override", () => {
    const props = {
      canConsentOverride: true,
      providedConsent: false
    };

    mountedComponent(<ProvidedConsent {...props} />, {}, [], [], formProps);
    expect(screen.getByText(/referral.provided_consent_label/i)).toBeInTheDocument();
  });

  it("should render <ProvidedForm> when child has not provided consent and user can't consent override", () => {
    const props = {
      canConsentOverride: false,
      providedConsent: false
    };

    mountedComponent(<ProvidedConsent {...props} />, {}, [], [], formProps);
    expect(screen.getByText(/referral.provided_consent_label/i)).toBeInTheDocument();
  });
});
