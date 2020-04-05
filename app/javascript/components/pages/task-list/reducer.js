import { fromJS } from "immutable";

import {
  TASKS_SUCCESS,
  TASKS_STARTED,
  TASKS_FINISHED,
  TASKS_FAILURE
} from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({ data: [] });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case TASKS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case TASKS_SUCCESS:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata));
    case TASKS_FINISHED:
      return state.set("loading", fromJS(payload));
    case TASKS_FAILURE:
      return state.set("errors", true);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
