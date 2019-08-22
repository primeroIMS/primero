import { fetchForms, fetchOptions } from "components/record-form";
import { batch } from "react-redux";
import * as Actions from "./actions";

export const setStyle = payload => {
  return {
    type: Actions.SET_STYLE,
    payload
  };
};

export const setAuth = payload => {
  return {
    type: Actions.SET_AUTH,
    payload
  };
};

export const loadResources = () => async dispatch => {
  batch(() => {
    dispatch(fetchForms());
    dispatch(fetchOptions());
  });
};

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

export const attemptSignout = () => async dispatch => {
  dispatch({
    type: Actions.LOGOUT,
    api: {
      path: "tokens",
      method: "DELETE",
      successCallback: Actions.LOGOUT_SUCCESS_CALLBACK
    }
  });
};

export const checkAuthentication = () => async dispatch => {
  const token = localStorage.getItem("jwt");
  const username = localStorage.getItem("username");

  dispatch(setAuth({ auth: !!token, username }));

  if (token) {
    dispatch(loadResources());
  }
};
