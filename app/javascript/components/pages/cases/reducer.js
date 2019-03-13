/* eslint-disable import/prefer-default-export */
import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map();

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.RECEIVE_CASES:
      return state.set("results", fromJS(payload));
    case Actions.SET_PAGINATION:
      return state.set("meta", fromJS(payload));
    case Actions.SET_FILTERS:
      return state.set("filters", fromJS(payload));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
