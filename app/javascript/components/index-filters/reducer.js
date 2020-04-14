import { Map, fromJS } from "immutable";

import { SET_FILTERS } from "./actions";

const DEFAULT_STATE = Map({});

export default namespace => (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case `${namespace}/${SET_FILTERS}`:
      return state.set("filters", fromJS(payload));
    default:
      return state;
  }
};
