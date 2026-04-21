import { fromJS } from "immutable";

import { POTENTIAL_MATCHES } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case POTENTIAL_MATCHES:
      return state.set("potentialMatches", fromJS(payload.data));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
