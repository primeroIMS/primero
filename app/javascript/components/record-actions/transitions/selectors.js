import NAMESPACE from "./namespace";

// TODO: Should be by transitionType to reuse
export const getAssignUsers = state =>
  state.getIn([NAMESPACE, "reassign", "users"]);

export const getErrorsByTransitionType = (state, transitionType) =>
  state.getIn([NAMESPACE, transitionType, "message"]);

export const getUsersByTransitionType = (state, transitionType) =>
  state.getIn([NAMESPACE, transitionType, "users"]);
