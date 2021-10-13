/* eslint-disable import/prefer-default-export */
import actions from "./actions";

export const fetchChangeLogs = (recordType, record) => ({
  type: actions.FETCH_CHANGE_LOGS,
  api: {
    path: `${recordType}/${record}/record_history`
  }
});
