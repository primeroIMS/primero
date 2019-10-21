import "test/test.setup";
import { expect } from "chai";
import clone from "lodash/clone";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { Formik } from "formik";
import { Button, FormControlLabel } from "@material-ui/core";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import users from "../../mocked-users";
import FormInternal from "./form-internal";
import ProvidedConsent from "./provided-consent";
import ReferralForm from "./component";

describe("<ReferralForm />", () => {
  let component;
  const initialState = Map({
    transitions: Map({
      mockUsers: users
    })
  });
  const props = {
    handleClose: () => {},
    userPermissions: Map({}),
    providedConsent: false
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(ReferralForm, props, initialState));
  });

  it("renders Formik", () => {
    expect(component.find(Formik)).to.have.length(1);
  });

  it("renders FormInternal", () => {
    expect(component.find(FormInternal)).to.have.length(1);
  });

  it("renders ProvidedConsent", () => {
    expect(component.find(ProvidedConsent)).to.have.length(1);
  });

  it("renders FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.length(1);
  });

  it("renders MuiCheckbox", () => {
    expect(component.find(MuiCheckbox)).to.have.length(1);
  });

  it("renders Button", () => {
    expect(component.find(Button)).to.have.length(2);
  });

  it("should accept valid props", () => {
    const componentProps = clone(
      component
        .find(ReferralForm)
        .first()
        .props()
    );
    expect(componentProps).to.have.property("handleClose");
    expect(componentProps).to.have.property("userPermissions");
    expect(componentProps).to.have.property("providedConsent");
    delete componentProps.handleClose;
    delete componentProps.userPermissions;
    delete componentProps.providedConsent;

    expect(componentProps).to.deep.equal({});
  });
});
