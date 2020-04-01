import { LOGIN, LOGIN_SUCCESS_CALLBACK } from "./actions";

export const attemptLogin = data => {
  return {
    type: LOGIN,
    api: {
      path: "tokens",
      method: "POST",
      body: { user: data },
      successCallback: LOGIN_SUCCESS_CALLBACK
    }
  };
};
