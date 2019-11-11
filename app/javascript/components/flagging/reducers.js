import { Map } from "immutable";

import { listEntriesToRecord } from "../../libs";

import NAMESPACE from "./namespace";
import {
  FETCH_FLAGS_SUCCESS,
  ADD_FLAG_SUCCESS,
  UNFLAG_SUCCESS
} from "./actions";
import { FlagRecord } from "./records";

const DEFAULT_STATE = Map({ data: [] });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_FLAGS_SUCCESS:
      return state.set("data", listEntriesToRecord(payload.data, FlagRecord));
    case ADD_FLAG_SUCCESS:
      return state.update("data", data => {
        return data.push(FlagRecord(payload.data));
      });
    case UNFLAG_SUCCESS:
      return state.set(
        "data",
        state.get("data").filter(i => i.id !== payload.data.id)
      );
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
