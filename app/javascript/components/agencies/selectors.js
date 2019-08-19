import NAMESPACE from "./namespace";

export const selectAgencies = state => {
  return state.getIn([NAMESPACE, "data"], []);
};
