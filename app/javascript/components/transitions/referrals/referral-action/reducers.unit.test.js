import { expect } from "chai";
import { fromJS } from "immutable";

import { reducers } from "./reducers";
import actions from "./actions";

describe("<ReferralAction /> - Reducers", () => {
  const defaultState = fromJS({
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

  it("should handle REFERRAL_DONE_SUCCESS", () => {
    const payload = {
      data: {
        status: "done",
        record_id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
        record_type: "case",
        transitioned_to: "primero_cp",
        id: "be62e823-4d9d-402e-aace-8e4865a4882e",
        transitioned_by: "primero",
        consent_overridden: true,
        type: "Referral",
        notes: "",
        service: "",
        remote: false,
        consent_individual_transfer: true,
        created_at: "2020-02-13T19:41:52.825Z",
        record_access_denied: true
      }
    };

    const expected = fromJS({
      data: [
        {
          id: "be62e823-4d9d-402e-aace-8e4865a4882e",
          record_id: "2fe3312b-8de2-4bd0-ab39-cdfc020f86b3",
          record_type: "case",
          created_at: "2020-02-13T19:41:52.825Z",
          notes: "",
          rejected_reason: "",
          remote: false,
          status: "done",
          type: "Referral",
          consent_overridden: true,
          consent_individual_transfer: true,
          transitioned_by: "primero",
          transitioned_to: "primero_cp",
          record_access_denied: true,
          service: ""
        }
      ],
      errors: false
    });

    const action = {
      type: actions.REFERRAL_DONE_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });
});
