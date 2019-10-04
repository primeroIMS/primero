import NAMESPACE from "./namespaces";

export const getAssignUsers = state => {
  return state.getIn([NAMESPACE, "assign", "users"]);
};
