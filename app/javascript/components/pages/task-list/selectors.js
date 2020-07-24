import { List, fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const selectListHeaders = (state, namespace) =>
  state.getIn(["user", "listHeaders", namespace], List([]));

export const getMetadata = state =>
  state.getIn(["records", NAMESPACE, "metadata"], fromJS({}));
