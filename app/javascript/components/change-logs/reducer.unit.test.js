import { fromJS } from "immutable";

import { listEntriesToRecord } from "../../libs";

import { ChangeLogsRecord } from "./records";
import reducer from "./reducer";
import actions from "./actions";

describe("ChangeLogs - Reducers", () => {
  const nsReducer = reducer.changeLogs;
  const defaultState = fromJS({
    data: []
  });

  it("should handle FETCH_CHANGE_LOGS_SUCCESS", () => {
    const data = [
      {
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        datetime: "2020-08-10T18:27:33Z",
        user_name: "primero",
        action: "update",
        record_changes: [
          { religion: { to: ["christianity"], from: null } },
          { name_nickname: { to: "Pat", from: null } },
          { national_id_no: { to: "0050M", from: null } }
        ]
      },
      {
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        datetime: "2020-08-10T18:25:55Z",
        user_name: "primero",
        action: "create",
        record_changes: []
      }
    ];
    const expected = fromJS({
      data: listEntriesToRecord(data, ChangeLogsRecord)
    });
    const action = {
      type: actions.FETCH_CHANGE_LOGS_SUCCESS,
      payload: {
        data
      }
    };
    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
