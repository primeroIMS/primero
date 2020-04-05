import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";

import ReferralAction from "./component";

describe("<ReferralAction /> - Component", () => {
  let component;
  const props = {
    openReferralDialog: false,
    close: () => {},
    recordType: "cases",
    recordId: "10",
    transistionId: "20"
  };
  const initialState = fromJS({
    data: [
      {
        id: "be62e823-4d9d-402e-aace-8e4865a4882e",
        record_id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
        record_type: "case",
        created_at: "2020-02-13T19:41:52.825Z",
        notes: "",
        rejected_reason: "",
        status: "in_progress",
        type: "Referral",
        consent_overridden: true,
        consent_individual_transfer: true,
        transitioned_by: "primero",
        transitioned_to: "primero_cp",
        service: null
      }
    ]
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      ReferralAction,
      props,
      initialState
    ));
  });

  it("renders ReferralAction component", () => {
    expect(component.find(ReferralAction)).to.have.length(1);
  });
});
