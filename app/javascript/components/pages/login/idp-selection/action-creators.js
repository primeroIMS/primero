import * as Actions from "../login-form/actions";

export const attemptLogin = data => {
  return {
    type: Actions.LOGIN,
    api: {
      path: "tokens",
      method: "POST",
      headers: { "Authorization": `Bearer ${data}` },
      successCallback: Actions.LOGIN_SUCCESS_CALLBACK
    }
  };
};
