import { fromJS } from "immutable";

import { RECORD_PATH, RECORD_TYPES } from "../../../config";

import reducer from "./reducer";
import actions from "./actions";

describe("bulk-transitons - Reducers", () => {
  const defaultState = fromJS({
    bulkTransitions: {}
  });

  it("should handle BULK_ASSIGN_USER_SAVE_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 422,
          resource: "/api/v2/cases/123abc/assigns",
          detail: "transitioned_to",
          message: ["transition.errors.to_user_can_receive"]
        }
      ]
    };
    const expected = fromJS({
      bulkTransitions: {
        loading: false
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_FAILURE}`,
      payload
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle BULK_ASSIGN_USER_SAVE_FINISHED", () => {
    const expected = fromJS({
      bulkTransitions: {
        loading: false
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_FINISHED}`,
      payload: false
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle BULK_ASSIGN_USER_SAVE_STARTED", () => {
    const expected = fromJS({
      bulkTransitions: {
        loading: true,
        data: [],
        errors: []
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_STARTED}`,
      payload: true
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle BULK_ASSIGN_USER_SAVE_SUCCESS", () => {
    const payload = {
      data: [
        {
          id: "68c34cd3-1ad2-48ce-a6ae-087d0a0a57fc",
          type: "Assign",
          status: "done",
          record_id: "c6f7f95a-3bc9-446d-9d2e-11b1726f38b1",
          record_type: RECORD_TYPES.cases,
          transitioned_to: "primero_cp",
          notes: "",
          transitioned_by: "primero",
          remote: false,
          consent_overridden: false,
          consent_individual_transfer: false,
          created_at: "2020-05-26T00:46:24.355Z",
          record_access_denied: false,
          record: {
            id: "c6f7f95a-3bc9-446d-9d2e-11b1726f38b1",
            owned_by: "primero_cp",
            owned_by_groups: [1],
            owned_by_full_name: "CP Worker",
            previously_owned_by: "primero_ftr_manager",
            associated_user_groups: ["usergroup-primero-cp"],
            reassigned_transferred_on: "2020-05-26T00:46:24.366Z",
            previously_owned_by_full_name: "FTR Manager"
          }
        }
      ],
      errors: [
        {
          status: 500,
          resource: "/api/v2/cases/assigns",
          message: "StandardError"
        }
      ]
    };
    const expected = fromJS({
      bulkTransitions: {
        data: [
          {
            notes: "",
            transitioned_by: "primero",
            remote: false,
            transitioned_to: "primero_cp",
            record_type: RECORD_TYPES.cases,
            record_access_denied: false,
            record_id: "c6f7f95a-3bc9-446d-9d2e-11b1726f38b1",
            created_at: "2020-05-26T00:46:24.355Z",
            consent_individual_transfer: false,
            record: {
              id: "c6f7f95a-3bc9-446d-9d2e-11b1726f38b1",
              owned_by: "primero_cp",
              owned_by_groups: [1],
              owned_by_full_name: "CP Worker",
              previously_owned_by: "primero_ftr_manager",
              associated_user_groups: ["usergroup-primero-cp"],
              reassigned_transferred_on: "2020-05-26T00:46:24.366Z",
              previously_owned_by_full_name: "FTR Manager"
            },
            status: "done",
            consent_overridden: false,
            type: "Assign",
            id: "68c34cd3-1ad2-48ce-a6ae-087d0a0a57fc"
          }
        ],
        errors: [
          {
            status: 500,
            resource: "/api/v2/cases/assigns",
            message: "StandardError"
          }
        ]
      }
    });
    const action = {
      type: `${RECORD_PATH.cases}/${actions.BULK_ASSIGN_USER_SAVE_SUCCESS}`,
      payload
    };

    const newState = reducer(RECORD_PATH.cases)(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
