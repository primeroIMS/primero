import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({
  Cases: {
    current: 0
  },
  Incidents: {
    current: 0
  },
  TracingRequests: {
    current: 0
  }
 });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_TAB:
      return state.setIn([payload.recordType, "current"], payload.value);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
