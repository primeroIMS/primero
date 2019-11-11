import { fromJS, Map } from "immutable";

import { OPEN_DRAWER } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({ drawerOpen: true });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case OPEN_DRAWER:
      return state.set("drawerOpen", fromJS(payload));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
