import { fromJS } from "immutable";

export const selectListHeaders = (state, namespace) =>
  state.getIn(["user", "listHeaders", namespace], fromJS([]));
