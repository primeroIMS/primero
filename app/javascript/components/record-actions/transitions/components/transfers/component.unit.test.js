import { fromJS } from "immutable";
import Alert from "@material-ui/lab/Alert";

import { setupMountedComponent } from "../../../../../test";

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
    userPermissions: fromJS(["manage"]),
    record: fromJS({ module_id: "module_1" }),
    recordType: "record_type_1",
    setDisabled: () => {},
    setPending: () => {}
  };

  it("should not render the Consent Not Provided Alert if consent was provided", () => {
    const { component } = setupMountedComponent(Transfers, initialProps, initialState);

    expect(component.find(Alert)).to.be.empty;
  });

  it("should render the Consent Not Provided Alert if consent was not provided", () => {
    const { component } = setupMountedComponent(Transfers, { ...initialProps, providedConsent: false }, initialState);

    expect(component.find(Alert)).to.have.lengthOf(1);
  });
});
