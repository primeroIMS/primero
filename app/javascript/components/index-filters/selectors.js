import { fromJS } from "immutable";

export const getFiltersByRecordType = (state, recordType) => {
  return state.getIn(["user", "filters", recordType], fromJS([]));
};

export const getFiltersValuesByRecordType = (state, recordType) => {
  return state.getIn(["records", recordType, "filters"], fromJS({}));
};
