import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({ drawerOpen: true });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.OPEN_DRAWER:
      return state.set("drawerOpen", fromJS(payload));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
