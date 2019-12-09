import { RECORD_PATH } from "../../config";

import { OPEN_DRAWER, FETCH_ALERTS } from "./actions";

export const openDrawer = payload => {
  return {
    type: OPEN_DRAWER,
    payload
  };
};

export const fetchAlerts = () => ({
  type: FETCH_ALERTS,
  api: {
    path: RECORD_PATH.alerts
  }
});
