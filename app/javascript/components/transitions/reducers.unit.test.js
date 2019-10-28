import { expect } from "chai";
import { fromJS } from "immutable";
import { mapEntriesToRecord } from "libs";
import { TransitionRecord } from "./records";
import * as r from "./reducers";
import * as Actions from "./actions";
import "test/chai-helpers";

describe("<Transitions /> - Reducers", () => {
  it("should handle FETCH_TRANSITIONS", () => {
    const initialState = fromJS({
      data: []
    });
    const data = [
      {
        id: "e172bbdd-4a99-4b8e-a2a5-e7e0af36f19a",
        record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
        record_type: "case",
        created_at: "2019-10-20T16:30:33.452Z",
        notes: "this is a note",
        status: "done",
        type: "Assign",
        transitioned_by: "primero",
        transitioned_to: "primero_cp"
      },
      {
        id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
        record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
        record_type: "case",
        created_at: "2019-10-20T16:13:33.890Z",
        notes: "this is another note",
        status: "inprogress",
        type: "Transfer",
        consent_overridden: false,
        consent_individual_transfer: true,
        transitioned_by: "primero",
        transitioned_to: "primero_mgr_cp"
      }
    ];
    const expected = fromJS({
      data: mapEntriesToRecord(data, TransitionRecord)
    });
    const action = {
      type: Actions.FETCH_TRANSITIONS_SUCCESS,
      payload: {
        data
      }
    };

    const newState = r.reducers(initialState, action);
    expect(newState.toJS()).to.eql(expected.toJS());
  });
});