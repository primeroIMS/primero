import { Map, List } from "immutable";

import { mapEntriesToRecord } from "../../libs";

import { FlagRecord } from "./records";
import reducer from "./reducer";

describe("<Flagging /> - Reducers", () => {
  const nsReducer = reducer.flags;
  const defaultState = Map({
    data: List([
      FlagRecord({
        id: 7,
        record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
        record_type: "cases",
        date: "2019-08-01",
        message: "This is a flag 1",
        flagged_by: "primero"
      })
    ])
  });

  it("should handle FETCH_FLAGS_SUCCESS", () => {
    const data = [
      {
        id: 7,
        record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
        record_type: "cases",
        date: "2019-08-01",
        message: "This is a flag 1",
        flagged_by: "primero"
      },
      {
        id: 2,
        record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
        record_type: "cases",
        date: "2019-08-01",
        message: "This is a flag 2",
        flagged_by: "primero"
      }
    ];
    const expected = Map({
      data: mapEntriesToRecord(data, FlagRecord)
    });
    const action = {
      type: "flags/FETCH_FLAGS_SUCCESS",
      payload: {
        data
      }
    };
    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ADD_FLAG_SUCCESS", () => {
    const expected = Map({
      data: [
        FlagRecord({
          id: 7,
          record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
          record_type: "cases",
          date: "2019-08-01",
          message: "This is a flag 1",
          flagged_by: "primero"
        }),
        FlagRecord({
          id: 3,
          record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
          record_type: "cases",
          date: "2019-08-01",
          message: "This is a flag 3",
          flagged_by: "primero"
        })
      ]
    });

    const action = {
      type: "flags/ADD_FLAG_SUCCESS",
      payload: {
        data: {
          id: 3,
          record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
          record_type: "cases",
          date: "2019-08-01",
          message: "This is a flag 3",
          flagged_by: "primero"
        }
      }
    };
    const newState = nsReducer(defaultState, action);

    expect(List(newState.get("data"))).to.deep.equal(List(expected.get("data")));
  });

  it("should handle UNFLAG_SUCCESS", () => {
    const expected = Map({
      data: List([
        FlagRecord({
          id: 7,
          record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
          record_type: "cases",
          date: "2019-08-01",
          message: "This is a flag 1",
          flagged_by: "primero",
          removed: true,
          unflag_message: "Removing flag",
          unflagged_date: "2020-06-25",
          unflagged_by: "primero"
        })
      ])
    });
    const action = {
      type: "flags/UNFLAG_SUCCESS",
      payload: {
        data: {
          record_id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0",
          record_type: "cases",
          unflag_message: "Removing flag",
          unflagged_date: "2020-06-25",
          unflagged_by: "primero",
          removed: true,
          id: 7,
          message: "This is a flag 1",
          date: "2019-08-01",
          flagged_by: "primero",
          created_at: "2020-06-24T21:40:04.161Z",
          system_generated_followup: false,
          record_access_denied: false,
          record: {
            id: "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0"
          }
        }
      }
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
