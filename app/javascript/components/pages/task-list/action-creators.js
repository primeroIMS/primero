import * as Actions from "./actions";
import { RECORD_PATH } from "config";
import { cleanUpFilters } from "components/records/helpers";

export const fetchTasks = data => async dispatch => {
  const { options } = data;

  dispatch({
    type: Actions.TASKS,
    api: {
      path: RECORD_PATH.tasks,
      params: cleanUpFilters(options)
    }
  });
};


