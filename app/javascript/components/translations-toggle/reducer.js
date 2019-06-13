import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({ anchorEl: null, themeDir: "ltr" });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_ANCHOR_EL:
      return state.set("anchorEl", fromJS(payload));
    case Actions.SET_THEME_DIRECTION:
      return state.set("themeDir", fromJS(payload));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
