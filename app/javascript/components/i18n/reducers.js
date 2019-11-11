import { Map } from "immutable";

import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({
  locale: null,
  dir: "ltr"
});

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_LOCALE:
      return state.set("locale", payload.locale).set("dir", payload.dir);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
