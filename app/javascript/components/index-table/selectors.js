import { fromJS, Map } from "immutable";

import { selectNetworkStatus } from "../connectivity/selectors";
import { keyIn } from "../../libs";

const getNamespacePath = namespace => ["records"].concat(namespace);

export const getRecords = (state, namespace, isComplete = false) => {
  const records = state.getIn(getNamespacePath(namespace), Map({}));
  const isOnline = selectNetworkStatus(state);
  const filters = records.get("filters", fromJS({}));

  if (isComplete && !isOnline) {
    return fromJS({ data: records.get("data").filter(record => record.get("complete"), false) });
  }

  if (!isOnline) {
    const sortedRecords = records.get("data", fromJS([])).sortBy(record => record.get(filters.get("order_by")));

    return fromJS({
      data: filters.get("order", "asc") === "asc" ? sortedRecords : sortedRecords.reverse(),
      metadata: records.get("metadata", fromJS({}))
    });
  }

  return records?.filter(keyIn("data", "metadata"));
};

export const getRecordsData = (state, namespace) => getRecords(state, namespace).get("data");

export const getFilters = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("filters"), Map({}));

export const getLoading = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("loading"));

export const getErrors = (state, namespace) => state.getIn(getNamespacePath(namespace).concat("errors"), false);
