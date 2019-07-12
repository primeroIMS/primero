import * as Actions from "./actions";

export const setTab = payload => {
  return {
    type: Actions.SET_TAB,
    payload
  };
};
