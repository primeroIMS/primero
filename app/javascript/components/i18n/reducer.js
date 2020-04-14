import { Map } from "immutable";

import { SET_LOCALE } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({
  locale: null,
  dir: "ltr"
});

export const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_LOCALE:
      return state.set("locale", payload.locale).set("dir", payload.dir);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
