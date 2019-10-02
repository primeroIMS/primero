import * as Actions from "./actions";

export const fetchTasks = () => async dispatch => {
  dispatch({
    type: Actions.TASKS,
    api: {
      path: "tasks"
    }
  });
};
