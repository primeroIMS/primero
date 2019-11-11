import { cleanUpFilters } from "../../records/helpers";
import { RECORD_PATH } from "../../../config";

import { TASKS } from "./actions";

export const fetchTasks = data => {
  const { options } = data ? data : {};

  return {
    type: TASKS,
    api: {
      path: RECORD_PATH.tasks,
      params: cleanUpFilters(options)
    }
  };
};
