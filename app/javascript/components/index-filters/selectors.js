import { fromJS } from "immutable";

export const getFiltersByRecordType = (state, recordType) => {
  return state.getIn(["user", "filters", recordType], fromJS([]));
};

export const getFiltersValuesByRecordType = (state, recordType) => {
  return state.getIn(["records", recordType, "filters"], fromJS({}));
};

export const getFiltersValueByRecordType = (state, recordType, key) => {
  return getFiltersValuesByRecordType(state, recordType).get(key, null);
};
