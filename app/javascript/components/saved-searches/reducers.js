import { Map } from "immutable";
import { listEntriesToRecord } from "libs";
import NAMESPACE from "./namespace";
import * as Actions from "./actions";
import * as R from "./records";

const DEFAULT_STATE = Map({ data: [] });

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_SAVED_SEARCHES_SUCCESS:
      return state.set(
        "data",
        listEntriesToRecord(payload.data, R.SavedSearchesRecord)
      );
    case Actions.REMOVE_SAVED_SEARCH_SUCCESS:
      return state.set(
        "data",
        state.get("data").filter(d => d.id !== payload.data.id)
      );
    case Actions.SAVE_SEARCH_SUCCESS:
      return state.update("data", data => [...data, payload.data]);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
