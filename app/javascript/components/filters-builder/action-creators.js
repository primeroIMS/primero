import * as Actions from "./actions";

export const setExpandedPanel = payload => {
  return {
    type: Actions.SET_EXPANSION_PANEL,
    payload
  };
};

export const removeExpandedPanel = payload => {
  return {
    type: Actions.REMOVE_EXPANDED_PANEL,
    payload
  };
};
