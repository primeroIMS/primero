import { Map, fromJS } from "immutable";

import { listEntriesToRecord } from "../../libs";

import NAMESPACE from "./namespace";
import actions from "./actions";
import { FlagRecord } from "./records";

const DEFAULT_STATE = Map({ data: [] });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_FLAGS_STARTED:
      return state.set("loading", true);
    case actions.FETCH_FLAGS_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_FLAGS_SUCCESS:
      return state.set("data", listEntriesToRecord(payload.data, FlagRecord));
    case actions.ADD_FLAG_SUCCESS:
      return state.update("data", data => {
        return data.push(FlagRecord(payload.data));
      });
    case actions.SET_SELECTED_FLAG: {
      const selectedFlag = state.get("data", fromJS([])).find(flag => flag.get("id") === payload.id);

      return state.set("selectedFlag", selectedFlag);
    }
    case actions.UNFLAG_SUCCESS: {
      const flagIndex = state.get("data", fromJS([])).findIndex(flag => flag.get("id") === payload.data.id);

      return state.setIn(["data", flagIndex], FlagRecord(payload.data));
    }
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
