import { expect } from "chai";
import { fromJS } from "immutable";

import { TransitionRecord } from "../../transitions/records";

import reducers from "./reducer";
import actions from "./actions";

describe("<Transitions /> - Reducers", () => {
  const defaultState = fromJS({
    data: []
  });

  it("should handle ASSIGN_USERS_FETCH_SUCCESS", () => {
    const payload = {
      data: [
        { label: "primero_cp", value: "primero_cp" },
        { label: "primero_gbv", value: "primero_gbv" }
      ]
    };
    const expected = fromJS({
      data: [],
      reassign: {
        users: [
          { label: "primero_cp", value: "primero_cp" },
          { label: "primero_gbv", value: "primero_gbv" }
        ]
      }
    });
    const action = {
      type: actions.ASSIGN_USERS_FETCH_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ASSIGN_USER_SAVE_FAILURE", () => {
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
      data: [],
      reassign: {
        errors: true,
        message: ["transition.errors.to_user_can_receive"]
      }
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_FAILURE,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ASSIGN_USER_SAVE_FINISHED", () => {
    const expected = fromJS({
      data: [],
      reassign: {
        loading: false
      }
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_FINISHED,
      payload: false
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ASSIGN_USER_SAVE_STARTED", () => {
    const expected = fromJS({
      data: [],
      reassign: {
        loading: true,
        errors: false
      }
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_STARTED,
      payload: true
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ASSIGN_USER_SAVE_SUCCESS", () => {
    const payload = {
      data: {
        id: "b46a12df-4db4-451c-98ff-c6301b90bf51",
        type: "Referral",
        record_id: "2a560934-39fd-4d5b-aedb-93e90f5df706",
        record_type: "case",
        transitioned_to: "primero_mgr_cp",
        transitioned_by: "primero",
        notes: "Some test",
        created_at: "2019-10-23T19:39:14.930Z",
        consent_overridden: false,
        consent_individual_transfer: false,
        rejected_reason: "",
        status: "done"
      }
    };
    const expected = fromJS({
      data: [TransitionRecord(payload.data)],
      reassign: {
        errors: false,
        message: []
      }
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_ERRORS", () => {
    const expected = fromJS({
      data: [],
      transfer: {
        errors: false,
        message: []
      }
    });
    const action = {
      type: actions.CLEAR_ERRORS,
      payload: "transfer"
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle TRANSFER_USERS_FETCH_SUCCESS", () => {
    const payload = {
      data: [{ label: "primero_cp", value: "primero_cp" }]
    };
    const expected = fromJS({
      data: [],
      transfer: {
        users: payload.data
      }
    });
    const action = {
      type: actions.TRANSFER_USERS_FETCH_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle TRANSFER_USER_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 422,
          resource: "/api/v2/cases/123abc/transfers",
          detail: "consent",
          message: ["transition.errors.consent"]
        }
      ]
    };
    const expected = fromJS({
      data: [],
      transfer: {
        errors: true,
        message: ["transition.errors.consent"]
      }
    });
    const action = {
      type: actions.TRANSFER_USER_FAILURE,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle TRANSFER_USER_STARTED", () => {
    const expected = fromJS({
      data: [],
      transfer: {
        errors: false
      }
    });
    const action = {
      type: actions.TRANSFER_USER_STARTED,
      payload: true
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle TRANSFER_USER_SUCCESS", () => {
    const payload = {
      data: {
        id: "b46a12df-4db4-451c-98ff-c6301b90bf51",
        type: "Transitions",
        record_id: "2a560934-39fd-4d5b-aedb-93e90f5df706",
        record_type: "case",
        transitioned_to: "primero_mgr_cp",
        transitioned_by: "primero",
        notes: "Test notes",
        created_at: "2019-10-23T19:39:14.930Z",
        consent_overridden: false,
        consent_individual_transfer: false,
        rejected_reason: "",
        status: "done"
      }
    };
    const expected = fromJS({
      data: [TransitionRecord(payload.data)],
      transfer: {
        errors: false,
        message: []
      }
    });
    const action = {
      type: actions.TRANSFER_USER_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("case Actions.REFERRAL_USERS_FETCH_SUCCESS", () => {
    const payload = {
      data: [{ label: "primero_cp", value: "primero_cp" }]
    };
    const expected = fromJS({
      data: [],
      referral: {
        users: payload.data
      }
    });
    const action = {
      type: actions.REFERRAL_USERS_FETCH_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("case Actions.REFER_USER_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 422,
          resource: "/api/v2/cases/123abc/transfers",
          detail: "consent",
          message: ["referral.errors.consent"]
        }
      ]
    };
    const expected = fromJS({
      data: [],
      referral: {
        errors: true,
        message: ["referral.errors.consent"]
      }
    });
    const action = {
      type: actions.REFER_USER_FAILURE,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("case Actions.REFER_USER_STARTED", () => {
    const expected = fromJS({
      data: [],
      referral: {
        errors: false
      }
    });
    const action = {
      type: actions.REFER_USER_STARTED,
      payload: true
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("case Actions.REFER_USER_SUCCESS", () => {
    const payload = {
      data: {
        id: "b46a12df-4db4-451c-98ff-c6301b90bf51",
        type: "Transitions",
        record_id: "2a560934-39fd-4d5b-aedb-93e90f5df706",
        record_type: "case",
        transitioned_to: "primero_mgr_cp",
        transitioned_by: "primero",
        notes: "Test notes",
        created_at: "2019-10-23T19:39:14.930Z",
        consent_overridden: false,
        consent_individual_transfer: false,
        rejected_reason: "",
        status: "done"
      }
    };
    const expected = fromJS({
      data: [TransitionRecord(payload.data)],
      referral: {
        errors: false,
        message: []
      }
    });
    const action = {
      type: actions.REFER_USER_SUCCESS,
      payload
    };

    const newState = reducers(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
