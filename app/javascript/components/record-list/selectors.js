import { fromJS } from "immutable";

export const getListHeaders = (state, namespace) =>
  state.getIn(["user", "listHeaders", namespace], fromJS([]));
