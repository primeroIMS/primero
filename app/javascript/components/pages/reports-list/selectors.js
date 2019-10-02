import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const selectReports = state => {
  return state.getIn(["records", NAMESPACE, "data"], fromJS([]));
};

export const selectReportsPagination = state => {
  return state.getIn(["records", NAMESPACE, "metadata"], fromJS({}));
};

export const selectLoading = state => {
  return state.getIn(["records", NAMESPACE, "loading"], false);
};
