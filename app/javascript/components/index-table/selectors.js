import { fromJS, Map } from "immutable";

import { selectNetworkStatus } from "../connectivity/selectors";
import { keyIn } from "../../libs";

const getNamespacePath = namespace => ["records"].concat(namespace);

export const getRecords = (state, namespace, isComplete = false) => {
  const data = state.getIn(getNamespacePath(namespace), Map({}))?.filter(keyIn("data", "metadata"));
  const isOnline = selectNetworkStatus(state);

  if (isComplete && !isOnline) {
    return fromJS({ data: data.get("data").filter(record => record.get("complete"), false) });
  }

  return data;
};

export const getRecordsData = (state, namespace) => getRecords(state, namespace).get("data");

export const getFilters = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("filters"), Map({}));

export const getLoading = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("loading"));

export const getErrors = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("errors"), false);
