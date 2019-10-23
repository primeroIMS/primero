import chai, { expect } from "chai";
import { List, Map } from "immutable";
import chaiImmutable from "chai-immutable";
import { TransitionRecord } from "./records";
import { mapEntriesToRecord } from "libs";
import * as r from "./reducers";
import * as Actions from "./actions";

chai.use(chaiImmutable);

describe("<Transitions /> - Reducers", () => {
  it("should handle FETCH_TRANSITIONS", () => {
    const defaultState = Map({});
    const dataTransitions = List([
      Map({
        id: "e172bbdd-4a99-4b8e-a2a5-e7e0af36f19a",
        record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
        record_type: "case",
        created_at: "2019-10-20T16:30:33.452Z",
        notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: "done",
        type: "Assign",
        transitioned_by: "primero",
        transitioned_to: "primero_cp"
      }),
      Map({
        id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
        record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
        record_type: "case",
        created_at: "2019-10-20T16:13:33.890Z",
        notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: "inprogress",
        type: "Transfer",
        consent_overridden: false,
        consent_individual_transfer: true,
        transitioned_by: "primero",
        transitioned_to: "primero_mgr_cp"
      })
    ]);
    const expected = Map({
      data: mapEntriesToRecord(dataTransitions, TransitionRecord)
    });
    const action = {
      // TODO change to FETCH_TRANSITIONS_SUCCESS
      type: Actions.FETCH_TRANSITIONS,
      payload: {
        dataTransitions
      }
    };

    const newState = r.reducers.transitions(defaultState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });
});