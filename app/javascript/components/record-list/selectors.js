import { fromJS } from "immutable";

export const getListHeaders = (state, namespace) =>
  state.getIn(["user", "listHeaders", namespace], fromJS([]));

export const getFields = state => state.getIn(["forms", "fields"], fromJS([]));
