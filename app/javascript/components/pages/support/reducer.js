import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case `${Actions.FETCH_DATA_SUCCESS}`:
      return state.set("data", fromJS(payload.data));
    case `${Actions.FETCH_DATA_STARTED}`:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case `${Actions.FETCH_DATA_FINISHED}`:
      return state.set("loading", fromJS(payload));
    case `${Actions.FETCH_DATA_FAILURE}`:
      return state.set("errors", true);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
