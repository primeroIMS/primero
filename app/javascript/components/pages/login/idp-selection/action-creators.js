import * as Actions from "../login-form/actions";

export const attemptLogin = () => {
  return {
    type: Actions.LOGIN,
    api: {
      path: "tokens",
      method: "POST",
      successCallback: Actions.LOGIN_SUCCESS_CALLBACK
    }
  };
};
