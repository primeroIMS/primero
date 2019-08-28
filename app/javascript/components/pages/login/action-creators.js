import * as Actions from "./actions";

export const attemptLogin = data => async dispatch => {
  dispatch({
    type: Actions.LOGIN,
    api: {
      path: "tokens",
      method: "POST",
      body: { user: data },
      successCallback: Actions.LOGIN_SUCCESS_CALLBACK
    }
  });
};
