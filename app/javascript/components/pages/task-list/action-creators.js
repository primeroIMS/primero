import { cleanUpFilters } from "./../../records/helpers";
import { RECORD_PATH } from "./../../../config";

import * as Actions from "./actions";

export const fetchTasks = data => {
  const { options } = data;

  return {
    type: Actions.TASKS,
    api: {
      path: RECORD_PATH.tasks,
      params: cleanUpFilters(options)
    }
  };
};


