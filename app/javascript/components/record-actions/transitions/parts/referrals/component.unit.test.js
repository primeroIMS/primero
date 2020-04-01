import { expect } from "chai";
import clone from "lodash/clone";
import { Map, List, fromJS } from "immutable";
import { Formik } from "formik";
import { FormControlLabel } from "@material-ui/core";
import { Checkbox as MuiCheckbox } from "formik-material-ui";

import { setupMountedComponent } from "../../../../../test";
import users from "../../mocked-users";

import FormInternal from "./form-internal";
import ProvidedConsent from "./provided-consent";
import ReferralForm from "./component";

describe("<ReferralForm />", () => {
  let component;
  const initialState = fromJS({
    records: {
      transitions: {
        mockUsers: users
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
  const record = Map({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "W",
    name_last: "D",
    name: "W D"
  });
  const props = {
    handleClose: () => {},
    userPermissions: Map({}),
    providedConsent: false,
    recordType: "cases",
    record
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

  it("should accept valid props", () => {
    const componentProps = clone(component.find(ReferralForm).first().props());

    expect(componentProps).to.have.property("handleClose");
    expect(componentProps).to.have.property("userPermissions");
    expect(componentProps).to.have.property("providedConsent");
    expect(componentProps).to.have.property("recordType");
    expect(componentProps).to.have.property("record");
    delete componentProps.handleClose;
    delete componentProps.userPermissions;
    delete componentProps.providedConsent;
    delete componentProps.recordType;
    delete componentProps.record;

    expect(componentProps).to.deep.equal({});
  });

  it("renders Formik with valid props", () => {
    const formikProps = { ...component.find(Formik).props() };

    expect(component.find(Formik)).to.have.lengthOf(1);
    [
      "enableReinitialize",
      "initialValues",
      "isInitialValid",
      "onSubmit",
      "render",
      "validateOnBlur",
      "validateOnChange",
      "validationSchema"
    ].forEach(property => {
      expect(formikProps).to.have.property(property);
      delete formikProps[property];
    });
    expect(formikProps).to.be.empty;
  });
});
