import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({
  cases: [],
  incidents: [],
  tracing_requests: []
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_EXPANSION_PANEL:
      return state.set(payload.namespace, [
        ...state.get(payload.namespace),
        payload.panel
      ]);
    case Actions.REMOVE_EXPANDED_PANEL:
      return state.set(
        payload.namespace,
        state.get(payload.namespace).filter(item => item !== payload.panel)
      );
    case Actions.RESET_PANELS:
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
