import { Map } from "immutable";

import { listEntriesToRecord } from "../../libs";

import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import * as R from "./records";

const DEFAULT_STATE = Map({ data: [] });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_FLAGS_SUCCESS:
      return state.set("data", listEntriesToRecord(payload.data, R.FlagRecord));
    case Actions.ADD_FLAG_SUCCESS:
      return state.update("data", data => {
        return data.push(R.FlagRecord(payload.data));
      });
    case Actions.UNFLAG_SUCCESS:
      return state.set(
        "data",
        state.get("data").filter(i => i.id !== payload.data.id)
      );
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
