/* eslint-disable no-unused-expressions */
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Field } from "formik";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import ProvidedForm from "./provided-form";

describe("<ProvidedForm /> - referrals", () => {
  const formProps = {
    initialValues: {
      referral: false
    }
  };
  it("should render properly when user can override consent", () => {
    const props = {
      canConsentOverride: true
    };
    const { component } = setupMountedComponent(
      ProvidedForm,
      props,
      {},
      [],
      formProps
    );

    expect(component.find(Grid), "renders 3 Grid").to.have.lengthOf(3);
    expect(
      component.find(FormControlLabel),
      "renders single FormControlLabel"
    ).to.have.lengthOf(1);
    expect(
      component.find(Checkbox),
      "renders single Checkbox"
    ).to.have.lengthOf(1);
    expect(component.find(Field), "renders single Field").to.have.lengthOf(1);
  });

  it("should render some components when user can not override consent", () => {
    const props = {
      canConsentOverride: false
    };
    const { component } = setupMountedComponent(
      ProvidedForm,
      props,
      {},
      [],
      formProps
    );

    expect(component.find(Grid), "renders 3 Grid").to.have.lengthOf(3);
    expect(
      component
        .find(Grid)
        .find("span")
        .props().children,
      "renders span with referral.provided_consent_labe"
    ).to.be.equal("referral.provided_consent_label");
    expect(
      component.find(FormControlLabel),
      "should not render FormControlLabel"
    ).to.not.have.lengthOf(1);
    expect(
      component.find(Checkbox),
      "should not render Checkbox"
    ).to.not.have.lengthOf(1);
  });
});
