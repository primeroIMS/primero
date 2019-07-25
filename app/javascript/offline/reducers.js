import { Map, fromJs } from "immutable";

import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map();

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_OFFLINE_ENCRYPTION: {
        const { salt, key } = payload;
        state = state.set("salt", salt).set("key", key);
        return state;
      }
    case Actions.SET_OFFLINE_ENCRYPTION_KEY: {
        const { key } = payload;
        state = state.set("key", key);
        return state;
      }
    default: {
        return state;
      }
  }
};

export const reducers = { [NAMESPACE]: reducer };
