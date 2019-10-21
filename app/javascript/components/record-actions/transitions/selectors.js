import NAMESPACE from "./namespace";

export const getErrorsByTransitionType = (state, transitionType) =>
  state.getIn([NAMESPACE, transitionType, "message"]);

export const getUsersByTransitionType = (state, transitionType) =>
  state.getIn([NAMESPACE, transitionType, "users"]);
