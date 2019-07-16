import * as Actions from "./actions";

export const fetchTasks = () => async dispatch => {
  dispatch({
    type: Actions.TASKS,
    payload: {
      data: [
        {
          id: "123",
          priority: "high",
          type: "Shelter temprary house",
          due_date: "2019-07-01",
          overdue: "true"
        },
        {
          id: "456",
          priority: "low",
          type: "Food service",
          due_date: "2019-07-01",
          overdue: "false"
        }
      ]
    }
  });
};
