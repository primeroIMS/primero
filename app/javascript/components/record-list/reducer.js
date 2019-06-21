import { fromJS, Map } from "immutable";
import * as Actions from "./actions";

const DEFAULT_STATE = Map({});

export const recordListReducer = namespace => ({
  [namespace]: (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
      case `${namespace}/${Actions.RECORDS_STARTED}`:
        return state.set("loading", fromJS(payload));
      case `${namespace}/${Actions.RECORDS_FAILED}`:
        return state.set("errors", fromJS(payload));
      case `${namespace}/${Actions.RECORDS_SUCCESS}`:
        return state
          .set("records", fromJS(payload.data))
          .set("metadata", fromJS(payload.metadata));
      case `${namespace}/${Actions.RECORDS_FINISHED}`:
        return state.set("loading", fromJS(payload));
      case `${namespace}/${Actions.SET_FILTERS}`:
        return state.set("filters", fromJS(payload));
      default:
        return state;
    }
  }
});
