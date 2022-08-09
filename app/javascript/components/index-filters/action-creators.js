import { isImmutable } from "immutable";
import omitBy from "lodash/omitBy";

import { DB_COLLECTIONS_NAMES, IDB_SAVEABLE_RECORD_TYPES } from "../../db";

export const setFilters = ({ recordType, data }) => ({
  type: `${recordType}/SET_FILTERS`,
  payload: data
});

export const applyFilters =
  ({ recordType, data }) =>
  async dispatch => {
    dispatch(setFilters({ recordType, data }));

    const filteredData =
      isImmutable(data) && data.get("order_by") === "complete"
        ? data.delete("order_by")
        : omitBy(data, (value, key) => key === "order_by" && value === "complete");

    dispatch({
      type: `${recordType}/RECORDS`,
      api: {
        path: `/${recordType.toLowerCase()}`,
        params: filteredData,
        ...(IDB_SAVEABLE_RECORD_TYPES.includes(recordType) && {
          db: { collection: DB_COLLECTIONS_NAMES.RECORDS, recordType }
        })
        // queueOffline: true
      }
    });
  };
