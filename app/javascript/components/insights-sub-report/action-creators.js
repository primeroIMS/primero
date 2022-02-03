/* eslint-disable import/prefer-default-export */

import actions from "./actions";

export const fetchInsight = (id, subReport, params = {}) => {
  return {
    type: actions.FETCH_INSIGHT,
    api: {
      path: `managed_reports/${id}`,
      params: {
        subreport: subReport,
        ...params
      }
    }
  };
};
