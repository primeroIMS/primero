import { Map } from "immutable";
import { listEntriesToRecord } from "libs";
import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import * as R from "./records";

const DEFAULT_STATE = Map({ data: [] });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    // TODO change to FETCH_TRANSITIONS_SUCCESS
    case Actions.FETCH_TRANSITIONS:
      return state.set(
        "data",
        listEntriesToRecord(payload.data, R.TransitionRecord)
      );
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
