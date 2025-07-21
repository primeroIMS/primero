// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { CHANGE_LOGS, ACCESS_LOG } from "../../config";

import { AccessLog, ChangeLog } from "./components";

export const getFilters = selectedForm => {
  switch (selectedForm) {
    case ACCESS_LOG:
      return AccessLog;
    case CHANGE_LOGS:
      return ChangeLog;
    default:
      return null;
  }
};
