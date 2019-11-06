import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.NUMBER_OF_CASES_SUCCESS:
      return state.set("numberOfCases", fromJS(payload))
    case Actions.REPORTING_DELAY_SUCCESS:
      return state.set("reportingDelay", fromJS(payload))
    default:
      return state;
  }
};

export const reducer = { [NAMESPACE]: reducer };
