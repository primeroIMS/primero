/* eslint-disable import/prefer-default-export */
import { RECORD_PATH } from "../../config";

import actions from "./actions";

export const fetchActivityLog = (params = {}) => ({
  type: actions.FECTH_ACTIVITY_LOGS,
  api: {
    path: RECORD_PATH.activity_log,
    params: params.data || {}
  }
});

export const setActivityLogsFilter = payload => ({
  type: actions.SET_ACTIVITY_LOGS_FILTER,
  payload
});
