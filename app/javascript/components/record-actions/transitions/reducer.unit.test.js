import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

describe("<Transitions /> - Reducers", () => {
  const defaultState = Map({});

  it("should handle ASSIGN_USERS_FETCH_SUCCESS", () => {
    const payload = {
      data: [
        { label: "primero_cp", value: "primero_cp" },
        { label: "primero_gbv", value: "primero_gbv" }
      ]
    };
    const expected = Map({
      reassign: Map({
        users: payload.data
      })
    });
    const action = {
      type: "transitions/ASSIGN_USERS_FETCH_SUCCESS",
      payload
    };

    const newState = r.reducers.transitions(defaultState, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle ASSIGN_USER_SAVE_STARTED", () => {
    const expected = Map({
      reassign: Map({
        loading: true,
        errors: false
      })
    });
    const action = {
      type: "transitions/ASSIGN_USER_SAVE_STARTED",
      payload: true
    };

    const newState = r.reducers.transitions(defaultState, action);
    expect(newState).to.eql(expected);
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
    const expected = Map({
      reassign: Map({
        errors: true,
        message: ["transition.errors.to_user_can_receive"]
      })
    });
    const action = {
      type: "transitions/ASSIGN_USER_SAVE_FAILURE",
      payload
    };

    const newState = r.reducers.transitions(defaultState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });

  it("should handle ASSIGN_USER_SAVE_SUCCESS", () => {
    const payload = {
      data: {
        id: "1e1b3f01-70dd-4944-92a9-adc5afc62ec0",
        type: "Assign",
        status: "done",
        record: {
          id: "123abc"
        }
      }
    };
    const expected = Map({
      reassign: Map({
        errors: false,
        message: []
      })
    });
    const action = {
      type: "transitions/ASSIGN_USER_SAVE_SUCCESS",
      payload
    };

    const newState = r.reducers.transitions(defaultState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });

  it("should handle ASSIGN_USER_SAVE_FINISHED", () => {
    const expected = Map({
      reassign: Map({
        loading: false
      })
    });
    const action = {
      type: "transitions/ASSIGN_USER_SAVE_FINISHED",
      payload: false
    };

    const newState = r.reducers.transitions(defaultState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });

  it("should handle ASSIGN_USER_SAVE_FINISHED", () => {
    const expected = Map({
      reassign: Map({
        errors: false,
        message: []
      })
    });
    const action = {
      type: "transitions/CLEAR_ERRORS",
      payload: "reassign"
    };

    const newState = r.reducers.transitions(defaultState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });
});
