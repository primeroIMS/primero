import { fromJS } from "immutable";

import { SET_FORM_FILTERS, CLEAR_FORM_FILTERS } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_FORM_FILTERS:
      return state.set(payload.formName, fromJS(payload.filters));
    case CLEAR_FORM_FILTERS:
      return state.delete(payload);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
