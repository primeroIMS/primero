import { List, fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const selectListHeaders = (state, namespace) => state.getIn(["user", "listHeaders", namespace], List([]));

export const getMetadata = (state, key, defaultValue = "") => {
  const metadata = state.getIn(["records", NAMESPACE, "metadata"], fromJS({}));

  if (key) {
    return metadata.get("field_names", fromJS(defaultValue));
  }

  return metadata;
};
