/* eslint-disable no-unused-expressions */

import { mountedComponent, screen } from "../../../../../test-utils";

import ProvidedForm from "./provided-form";

describe("<ProvidedForm /> - referrals", () => {
  const formProps = {
    initialValues: {
      referral: false,
      agency: "unicef"
    }
  };

  it("should render properly when user can override consent", () => {
    const overrideProps = {
      canConsentOverride: true
    };

    mountedComponent(<ProvidedForm {...overrideProps} />, {}, [], [], formProps);
    expect(screen.queryAllByTestId("grid")).toHaveLength(3);
    expect(screen.getByTestId("form-control")).toBeInTheDocument();
    expect(screen.getByText(/referral.refer_anyway_label/i)).toBeInTheDocument();
  });

  it("should render some components when user can not override consent", () => {
    const canNotOverrideProps = {
      canConsentOverride: false
    };

    mountedComponent(<ProvidedForm {...canNotOverrideProps} />, {}, [], [], formProps);
    expect(screen.queryAllByTestId("grid")).toHaveLength(3);
    expect(screen.queryByTestId("form-control")).toBeNull();
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(screen.getByText(/referral.provided_consent_label/i)).toBeInTheDocument();

  });
});
