import { TASKS } from "./actions";

export const fetchTasks = () => {
  return {
    type: TASKS,
    api: {
      path: "tasks"
    }
  };
};
