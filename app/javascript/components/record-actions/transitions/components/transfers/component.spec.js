import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";

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
    expect(screen.queryAllByRole("combobox")).toHaveLength(3);
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

    expect(screen.queryAllByRole("combobox")).toHaveLength(3);
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

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.queryAllByRole("checkbox")).toHaveLength(3);
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
