import { fromJS } from "immutable";

import { SET_DRAWER, TOGGLE_DRAWER } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_DRAWER:
      return state.set(payload.name, payload.open);
    case TOGGLE_DRAWER:
      return state.update(data => data.set(payload, !data.get(payload, false)));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
