import { fromJS, Map } from "immutable";

import { OPEN_DRAWER, FETCH_ALERTS_SUCCESS } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({ drawerOpen: true });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case OPEN_DRAWER:
      return state.set("drawerOpen", fromJS(payload));
    case FETCH_ALERTS_SUCCESS:
      return state.set("alerts", fromJS(payload));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
