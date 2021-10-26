import { fromJS } from "immutable";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Checkbox } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";
import Form from "../../../../form";

import Transfers from "./component";

describe("<RecordActions />/transitions/components/<Transfers />", () => {
  const initialState = fromJS({
    forms: {
      options: {
        lookups: [],
        locations: []
      }
    },
    records: {
      transitions: {
        referral: {
          users: []
        }
      }
    },
    application: {
      reportingLocationConfig: { admin_level: 1 },
      agencies: []
    }
  });

  const initialProps = {
    isBulkTransfer: false,
    providedConsent: true,
    canConsentOverride: false,
    record: fromJS({ module_id: "module_1" }),
    recordType: "record_type_1",
    setDisabled: () => {},
    setPending: () => {}
  };

  it("should not render the Consent Not Provided Alert if consent was provided", () => {
    const { component } = setupMountedComponent(Transfers, initialProps, initialState);

    expect(component.find(Alert)).to.be.empty;
  });

  it("should not disabled field if consent was provided", () => {
    const { component } = setupMountedComponent(Transfers, initialProps, initialState);

    expect(component.find(Autocomplete).first().props().disabled).to.be.false;
  });

  it("should render the Consent Not Provided Alert if consent was not provided", () => {
    const { component } = setupMountedComponent(Transfers, { ...initialProps, providedConsent: false }, initialState);

    expect(component.find(Alert)).to.have.lengthOf(1);
  });

  it("should disabled field if consent was not provided", () => {
    const { component } = setupMountedComponent(Transfers, { ...initialProps, providedConsent: false }, initialState);

    expect(component.find(Autocomplete).first().props().disabled).to.be.true;
  });

  describe("when consent was not provided ", () => {
    it("should not render checkbox if can not override consent", () => {
      const { component } = setupMountedComponent(Transfers, { ...initialProps, providedConsent: false }, initialState);

      expect(component.find(Alert)).to.have.lengthOf(1);
      expect(component.find(Checkbox)).to.have.lengthOf(2);
    });

    it("should render checkbox if can not override consent", () => {
      const { component } = setupMountedComponent(
        Transfers,
        { ...initialProps, providedConsent: false, canConsentOverride: true },
        initialState
      );

      expect(component.find(Alert)).to.have.lengthOf(1);
      expect(component.find(Checkbox)).to.have.lengthOf(3);
    });

    it("should set the consent_overridden to true if checked", () => {
      const { component } = setupMountedComponent(
        Transfers,
        { ...initialProps, providedConsent: false, canConsentOverride: true },
        initialState
      );

      component.find(Form).props().onSubmit({ transfer: true });

      expect(component.props().store.getActions()[0].api.body.data.consent_overridden).to.be.true;
    });
  });

  describe("when consent is provided", () => {
    it("should set the consent_overridden to false", () => {
      const { component } = setupMountedComponent(
        Transfers,
        { ...initialProps, providedConsent: true, canConsentOverride: true },
        initialState
      );

      component.find(Form).props().onSubmit({ transfer: true });

      expect(component.props().store.getActions()[0].api.body.data.consent_overridden).to.be.false;
    });
  });
});
