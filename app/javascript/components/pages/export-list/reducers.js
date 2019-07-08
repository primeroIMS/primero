import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.EXPORTS:
      return state.set("exports", fromJS(payload.exports));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
