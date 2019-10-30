import { fromJS } from "immutable";
import * as Actions from "./actions";
import * as R from "./records";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case `${Actions.FETCH_DATA_SUCCESS}`:
      return state.set("data", R.ContactInformationRecord(payload.data));
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
