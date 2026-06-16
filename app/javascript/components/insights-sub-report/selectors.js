/* eslint-disable import/prefer-default-export */

import { fromJS, List } from "immutable";

import NAMESPACE from "./namespace";

export const getInsight = state => {
  return state.getIn(["records", NAMESPACE, "selectedReport"], fromJS({}));
};

export const getInsightFilter = (state, filter) => {
  return state.getIn(["records", NAMESPACE, "filters", filter]);
};

export const getIsGroupedInsight = (state, subReport) =>
  state
    .getIn(["records", NAMESPACE, "selectedReport", "report_data", subReport, "data"], fromJS({}))
    .valueSeq()
    .some(elems => List.isList(elems) && elems.some(elem => elem.get("group_id")));

export const getSubReport = state => {
  return state.getIn(["records", NAMESPACE, "filters", "subreport"], false);
};
