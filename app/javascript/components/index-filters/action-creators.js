import { DB_COLLECTIONS_NAMES, IDB_SAVEABLE_RECORD_TYPES } from "../../db";

export const setFilters = ({ recordType, data }) => ({
  type: `${recordType}/SET_FILTERS`,
  payload: data
});

export const applyFilters = ({ recordType, data }) => dispatch => {
  dispatch(setFilters({ recordType, data }));

  dispatch({
    type: `${recordType}/RECORDS`,
    api: {
      path: `/${recordType.toLowerCase()}`,
      params: data,
      ...(IDB_SAVEABLE_RECORD_TYPES.includes(recordType) && {
        db: { collection: DB_COLLECTIONS_NAMES.RECORDS, recordType }
      })
    }
  });
};
