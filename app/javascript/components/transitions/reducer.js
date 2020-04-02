import { Map } from "immutable";

import { listEntriesToRecord } from "../../libs";

import { FETCH_TRANSITIONS_SUCCESS } from "./actions";
import { TransitionRecord } from "./records";

const DEFAULT_STATE = Map({ data: [] });

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_TRANSITIONS_SUCCESS:
      return state.set(
        "data",
        listEntriesToRecord(payload.data, TransitionRecord)
      );
    default:
      return state;
  }
};
