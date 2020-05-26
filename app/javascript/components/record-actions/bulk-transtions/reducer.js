import { fromJS } from "immutable";

import actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({ NAMESPACE: {} });

export default namespace => (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case `${namespace}/${actions.BULK_ASSIGN_USER_SAVE_STARTED}`:
      return state
        .setIn([NAMESPACE, "loading"], true)
        .setIn([NAMESPACE, "data"], fromJS([]))
        .setIn([NAMESPACE, "errors"], fromJS([]));
    case `${namespace}/${actions.BULK_ASSIGN_USER_SAVE_FINISHED}`:
      return state.setIn([NAMESPACE, "loading"], false);
    case `${namespace}/${actions.BULK_ASSIGN_USER_SAVE_FAILURE}`:
      return state.setIn([NAMESPACE, "loading"], false);
    case `${namespace}/${actions.BULK_ASSIGN_USER_SAVE_SUCCESS}`:
      return state
        .setIn([NAMESPACE, "data"], fromJS(payload.data))
        .setIn([NAMESPACE, "errors"], fromJS(payload.errors) || fromJS([]));
    case `${namespace}/${actions.CLEAR_BULK_ASSIGN_MESSAGES}`:
      return state
        .setIn([NAMESPACE, "loading"], false)
        .setIn([NAMESPACE, "data"], fromJS([]))
        .setIn([NAMESPACE, "errors"], fromJS([]));
    default:
      return state;
  }
};
