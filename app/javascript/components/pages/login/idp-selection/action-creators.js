import { LOGIN, LOGIN_SUCCESS_CALLBACK } from "../login-form/actions";

export const attemptLogin = () => {
  return {
    type: LOGIN,
    api: {
      path: "tokens",
      method: "POST",
      successCallback: LOGIN_SUCCESS_CALLBACK
    }
  };
};
