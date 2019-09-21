import { fromJS, Map } from "immutable";
import * as Actions from "./actions";

const DEFAULT_STATE = Map({});

export const recordListReducer = namespace => (
  state = DEFAULT_STATE,
  { type, payload }
) => {
  switch (type) {
    case `${namespace}/${Actions.RECORDS_STARTED}`:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case `${namespace}/${Actions.RECORDS_FAILURE}`:
      return state.set("errors", true);
    case `${namespace}/${Actions.RECORDS_SUCCESS}`:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata));
    case `${namespace}/${Actions.RECORDS_FINISHED}`:
      return state.set("loading", fromJS(payload));
    default:
      return state;
  }
};
