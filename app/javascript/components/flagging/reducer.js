import { Map, fromJS } from "immutable";

import { listEntriesToRecord } from "../../libs";

import NAMESPACE from "./namespace";
import {
  FETCH_FLAGS_SUCCESS,
  ADD_FLAG_SUCCESS,
  UNFLAG_SUCCESS
} from "./actions";
import { FlagRecord } from "./records";

const DEFAULT_STATE = Map({ data: [] });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_FLAGS_SUCCESS:
      return state.set("data", listEntriesToRecord(payload.data, FlagRecord));
    case ADD_FLAG_SUCCESS:
      return state.update("data", data => {
        return data.push(FlagRecord(payload.data));
      });
    case UNFLAG_SUCCESS: {
      const flagIndex = state
        .get("data", fromJS([]))
        .findIndex(flag => flag.get("id") === payload.data.id);

      return state.setIn(["data", flagIndex], FlagRecord(payload.data));
    }
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
