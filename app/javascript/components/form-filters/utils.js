/* eslint-disable import/prefer-default-export */
import { CHANGE_LOGS, ACCESS_LOGS } from "../../config";

import { AccessLog, ChangeLog } from "./components";

export const getFilters = selectedForm => {
  switch (selectedForm) {
    case ACCESS_LOGS:
      return AccessLog;
    case CHANGE_LOGS:
      return ChangeLog;
    default:
      return null;
  }
};
