import { fromJS } from "immutable";

const getNamespacePath = namespace => ["records"].concat(namespace);

export const getListHeaders = (state, namespace) => state.getIn(["user", "listHeaders", namespace], fromJS([]));

export const getFields = state => state.getIn(["forms", "fields"], fromJS([]));

export const getMetadata = (state, namespace) =>
  state.getIn(getNamespacePath(namespace).concat("metadata"), fromJS({}));
