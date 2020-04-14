/* eslint-disable import/prefer-default-export */

import { cleanUpFilters } from "../../records/utils";
import { RECORD_PATH } from "../../../config";

import { TASKS } from "./actions";

export const fetchTasks = data => {
  const { options } = data || {};

  return {
    type: TASKS,
    api: {
      path: RECORD_PATH.tasks,
      params: cleanUpFilters(options)
    }
  };
};
