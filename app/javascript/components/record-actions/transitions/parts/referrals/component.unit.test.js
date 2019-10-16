import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Formik } from "formik";
import { Button, FormControlLabel } from "@material-ui/core";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import FormInternal from "./form-internal";
import ProvidedConsent from "./provided-consent";
import ReferralForm from "./component";

describe("<ReferralForm />", () => {
  let component;
  const props = {
    handleClose: () => {}
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(ReferralForm, props));
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
});
