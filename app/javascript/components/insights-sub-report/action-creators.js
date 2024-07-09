// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

export const setSubReport = payload => ({
  type: actions.SET_SUB_REPORT,
  payload
});
