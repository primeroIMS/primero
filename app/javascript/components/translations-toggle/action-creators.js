import * as Actions from "./actions";

export const setAnchorEl = payload => async dispatch => {
  dispatch({
    type: Actions.SET_ANCHOR_EL,
    payload
  });
};

export const setThemeDirection = payload => {
  return {
    type: Actions.SET_THEME_DIRECTION,
    payload
  };
};
