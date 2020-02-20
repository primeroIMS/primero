import { fromJS } from "immutable";

import { expect } from "../../../../test";
import { TransitionRecord } from "../../records";

import { reducer } from "./reducers";
import actions from "./actions";

describe("<RevokeModal /> - transitions/components/revoke-modal/reducers", () => {
  it("should handle REVOKE_TRANSITION_SUCCESS", () => {
    const transition = {
      status: "in_progress",
      record_id: "f812ad0f-fb09-4438-a500-942c42b2a458",
      record_type: "case",
      transitioned_to: "primero_cp_ar",
      id: "89487898-7050-4762-b27d-5dc435a67710",
      transitioned_by: "primero",
      consent_overridden: true,
      type: "Referral",
      notes: "",
      service: "safehouse_service",
      remote: false,
      consent_individual_transfer: false,
      created_at: "2020-02-18T14:34:42.186Z",
      record_access_denied: false
    };
    const state = fromJS({
      transitions: {
        data: [TransitionRecord(transition)]
      }
    });
    const data = { ...transition, status: "done", record: { id: 1 } };

    const action = {
      type: actions.REVOKE_TRANSITION_SUCCESS,
      payload: {
        data
      }
    };

    const newState = reducer(state, action);

    delete data.record;
    const expected = fromJS({
      transitions: {
        data: [TransitionRecord(data)]
      }
    });

    expect(newState).to.deep.equal(expected);
  });
});
