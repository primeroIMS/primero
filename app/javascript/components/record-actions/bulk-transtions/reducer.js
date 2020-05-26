import { fromJS } from "immutable";

import Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({ data: [] });

export default () => (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case `${Actions.BULK_ASSIGN_USER_SAVE_STARTED}`:
      return state
        .setIn([NAMESPACE, "loading"], true)
        .setIn([NAMESPACE, "data"], fromJS([]))
        .setIn([NAMESPACE, "errors"], fromJS([]));
    case `${Actions.BULK_ASSIGN_USER_SAVE_FINISHED}`:
      return state.setIn([NAMESPACE, "loading"], false);
    case `${Actions.BULK_ASSIGN_USER_SAVE_FAILURE}`:
      return state.setIn([NAMESPACE, "loading"], false);
    case `${Actions.BULK_ASSIGN_USER_SAVE_SUCCESS}`:
      return state
        .setIn([NAMESPACE, "data"], fromJS(payload.data))
        .setIn([NAMESPACE, "errors"], fromJS(payload.errors) || fromJS([]));
    default:
      return state;
  }
};
