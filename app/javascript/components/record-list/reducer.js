import { fromJS, Map } from "immutable";
import * as Actions from "./actions";

const DEFAULT_STATE = Map({});

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.RECORDS_STARTED:
      return state.set("loading", fromJS(payload));
    case Actions.RECORDS_FAILED:
      return state.set("errors", fromJS(payload));
    case Actions.RECORDS_SUCCESS:
      return state
        .set("records", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata));
    case Actions.RECORDS_FINISHED:
      return state.set("loading", fromJS(payload));
    case Actions.SET_FILTERS:
      return state.set("filters", fromJS(payload));
    default:
      return state;
  }
};
