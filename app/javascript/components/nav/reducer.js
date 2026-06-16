import { fromJS, Map } from "immutable";

import { FETCH_ALERTS_SUCCESS } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({ drawerOpen: true });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_ALERTS_SUCCESS:
      return state.set("alerts", fromJS(payload));
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
