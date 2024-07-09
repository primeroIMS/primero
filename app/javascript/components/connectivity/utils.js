// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { CONNECTED, CONNECTION_LOST, FIELD_MODE_OFFLINE } from "./constants";

export function getConnectionStatus(online = false, fieldMode = false) {
  if (fieldMode) {
    return FIELD_MODE_OFFLINE;
  }

  if (online) {
    return CONNECTED;
  }

  return CONNECTION_LOST;
}
