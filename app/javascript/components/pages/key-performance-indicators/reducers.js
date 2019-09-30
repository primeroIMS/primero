import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_NUMBER_OF_CASES:
      return state.set("fetchingNumberOfCases", true);
    case Actions.RECEIVE_NUMBER_OF_CASES:
      return state.set("numberOfCases", fromJS(payload))
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
