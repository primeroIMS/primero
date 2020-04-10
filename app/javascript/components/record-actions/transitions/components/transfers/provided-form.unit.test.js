import { Field } from "formik";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";
import actions from "../../actions";
import { RECORD_TYPES } from "../../../../../config";

import ProvidedForm from "./provided-form";

describe("<ProvidedForm /> - transfers", () => {
  const formProps = {
    initialValues: {
      transfer: false,
      agency: "unicef"
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
      component.find(Grid).find("span").props().children,
      "renders span with transfer.provided_consent_labe"
    ).to.be.equal("transfer.provided_consent_label");
    expect(
      component.find(FormControlLabel),
      "should not render FormControlLabel"
    ).to.not.have.lengthOf(1);
    expect(
      component.find(Checkbox),
      "should not render Checkbox"
    ).to.not.have.lengthOf(1);
  });

  it("should reload users if any agency, location or user has changed", () => {
    const props = {
      canConsentOverride: true,
      setDisabled: () => {},
      recordType: "cases"
    };
    const { component } = setupMountedComponent(
      ProvidedForm,
      props,
      {},
      [],
      formProps
    );
    const trasnferAnyway = component.find(Checkbox);
    const storeActions = component.props().store.getActions();
    const expectedAction = {
      type: actions.TRANSFER_USERS_FETCH,
      api: {
        path: actions.USERS_TRANSFER_TO,
        params: {
          record_type: RECORD_TYPES.cases
        }
      }
    };

    trasnferAnyway
      .find("input")
      .simulate("change", { target: { checked: true } });

    expect(storeActions[1]).to.deep.equal(expectedAction);
  });
});
