import { Map } from "immutable";
import { listEntriesToRecord } from "libs";
import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import * as R from "./records";

const DEFAULT_STATE = Map({ data: [] });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_FLAGS_SUCCESS:
      return state.set("data", listEntriesToRecord(payload, R.FlagRecord));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
