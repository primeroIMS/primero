import { fromJS } from "immutable";

import { mountedComponent, screen, fireEvent } from "../../../../../test-utils";

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
    mountedComponent(<Transfers {...initialProps} />, initialState);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("should not disabled field if consent was provided", () => {
    mountedComponent(<Transfers {...initialProps} />, initialState);
    const textFields = document.querySelectorAll('input[type="text"]');

    textFields.forEach(combobox => {
      expect(combobox).not.toBeDisabled();
    });
  });

  it("should render the Consent Not Provided Alert if consent was not provided", () => {
    const props = {
      ...initialProps,
      providedConsent: false
    };

    mountedComponent(<Transfers {...props} />, initialState);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should disabled field if consent was not provided", () => {
    const props = {
      ...initialProps,
      providedConsent: false
    };

    mountedComponent(<Transfers {...props} />, initialState);

    const textFields = document.querySelectorAll('input[type="text"]');

    textFields.forEach(field => {
      expect(field).toBeDisabled();
    });
  });

  describe("when consent was not provided ", () => {
    it("should not render checkbox if can not override consent", () => {
      const props = {
        ...initialProps,
        providedConsent: false
      };

      mountedComponent(<Transfers {...props} />, initialState);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.queryAllByRole("checkbox")).toHaveLength(2);
    });

    it("should render checkbox if can not override consent", () => {
      const props = {
        ...initialProps,
        providedConsent: false,
        canConsentOverride: true
      };

      mountedComponent(<Transfers {...props} />, initialState);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.queryAllByRole("checkbox")).toHaveLength(3);
    });

    it("should set the consent_overridden to true if checked", () => {
      const props = {
        ...initialProps,
        providedConsent: false,
        canConsentOverride: true
      };

      mountedComponent(<Transfers {...props} />, initialState);

      document.querySelectorAll('input[type="text"]').forEach(field => {
        expect(field).toBeDisabled();
      });

      const consentCheckbox = document.querySelectorAll('input[type="checkbox"]')[0];

      expect(consentCheckbox).not.toBeChecked();
      fireEvent.click(consentCheckbox);
      expect(consentCheckbox).toBeChecked();

      document.querySelectorAll('input[type="text"]').forEach(field => {
        expect(field).not.toBeDisabled();
      });
    });
  });

  describe("when consent is provided", () => {
    it("should set the consent_overridden to false", () => {
      const props = {
        ...initialProps,
        providedConsent: true,
        canConsentOverride: true
      };

      mountedComponent(<Transfers {...props} />, initialState);

      expect(screen.queryByRole("alert")).toBeNull();
      expect(screen.queryAllByRole("checkbox")).toHaveLength(2);
    });
  });
});
