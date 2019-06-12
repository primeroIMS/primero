import * as Actions from "./actions";

export const openDrawer = payload => {
  return {
    type: Actions.OPEN_DRAWER,
    payload
  };
};
