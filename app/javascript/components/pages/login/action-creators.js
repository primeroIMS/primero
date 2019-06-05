import * as Actions from "./actions";

export const setStyle = payload => async dispatch => {
  dispatch({
    type: Actions.SET_STYLE,
    payload
  });
};

export const logIn = payload => {
  return {
    type: Actions.LOGIN,
    payload
  };
};
