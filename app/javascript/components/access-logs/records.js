// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import { Record } from "immutable";

export const AccessLogsRecord = Record({
  id: null,
  timestamp: null,
  full_name: null,
  user_name: null,
  action: null,
  role_name: null,
  record_type: null,
  record_id: null
});
