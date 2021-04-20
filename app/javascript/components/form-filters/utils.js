/* eslint-disable import/prefer-default-export */
import { CHANGE_LOGS } from "../../config";

import { ChangeLog } from "./components";

export const getFilters = selectedForm => {
  switch (selectedForm) {
    case CHANGE_LOGS:
      return ChangeLog;
    default:
      return null;
  }
};
