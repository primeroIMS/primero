/* eslint-disable import/prefer-default-export */
import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.CASES_STARTED:
      return state.set("loading", fromJS(payload));
    case Actions.CASES_FAILED:
      return state.set("errors", fromJS(payload));
    case Actions.CASES_SUCCESS:
      return state
        .set("results", fromJS(payload.results))
        .set("meta", fromJS(payload.meta));
    case Actions.CASES_FINISHED:
      return state.set("loading", fromJS(payload));
    case Actions.SET_FILTERS:
      return state.set("filters", fromJS(payload));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
