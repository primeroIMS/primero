import { fromJS } from "immutable";

export const getListHeaders = (state, namespace) =>
  state.getIn(["user", "listHeaders", namespace], fromJS([]));

export const getFields = state => state.getIn(["forms", "fields"], fromJS([]));

export const getMetadata = (state, namespace) =>
  state.getIn(["records", namespace, "metadata"], fromJS({}));
