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
      successCallback: (resp, respData) => {
        if (respData && respData.token) {
          localStorage.setItem("jwt", respData.token);
          dispatch(loadResources());
        }
      }
    }
  });
};

export const attemptSignout = () => async dispatch => {
  dispatch({
    type: Actions.LOGOUT,
    api: {
      path: "tokens",
      method: "DELETE",
      successCallback: () => {
        localStorage.removeItem("jwt");
      }
    }
  });
};

export const checkAuthentication = () => async dispatch => {
  const token = localStorage.getItem("jwt");

  dispatch(setAuth(!!token));

  if (token) {
    dispatch(loadResources());
  }
};
