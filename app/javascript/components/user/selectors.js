import NAMESPACE from "./namespace";

export const currentUser = state => state.getIn([NAMESPACE, "username"]);
