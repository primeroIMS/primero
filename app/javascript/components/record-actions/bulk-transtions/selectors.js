import { fromJS } from "immutable";

import NAMESPACE from "./namespace";

export const getNumberErrorsBulkAssign = (state, recordType) => {
  return state.getIn(["records", recordType, NAMESPACE, "errors"], fromJS([]))
    .size;
};

export const getNumberBulkAssign = (state, recordType) => {
  return state.getIn(["records", recordType, NAMESPACE, "data"], fromJS([]))
    .size;
};
