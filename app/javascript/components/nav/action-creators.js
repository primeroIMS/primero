// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { RECORD_PATH } from "../../config";

import { FETCH_ALERTS } from "./actions";

export const fetchAlerts = () => ({
  type: FETCH_ALERTS,
  api: {
    path: RECORD_PATH.alerts
  }
});
