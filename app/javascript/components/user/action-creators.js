import { DB_COLLECTIONS_NAMES } from "../../db";
import { loadApplicationResources } from "../application";

import { Actions } from "./actions";

export const setUser = payload => {
  return {
    type: Actions.SET_AUTHENTICATED_USER,
    payload
  };
};

export const fetchAuthenticatedUserData = id => async dispatch => {
  dispatch({
    type: Actions.FETCH_USER_DATA,
    api: {
      path: `users/${id}`,
      params: {
        extended: true
      },
      db: {
        collection: DB_COLLECTIONS_NAMES.USER
      }
    }
  });
};

export const setAuthenticatedUser = user => async dispatch => {
  dispatch(setUser(user));
  dispatch(fetchAuthenticatedUserData(user.id));
  dispatch(loadApplicationResources());
};

export const attemptSignout = (usingIdp, signOut) => async dispatch => {
  dispatch({
    type: Actions.LOGOUT,
    api: {
      path: "tokens",
      method: "DELETE",
      successCallback: Actions.LOGOUT_SUCCESS_CALLBACK
    }
  });

  if (usingIdp) {
    signOut();
  }
};

export const checkUserAuthentication = () => async dispatch => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    dispatch(setAuthenticatedUser(user));
  }
};

export const refreshToken = () => async dispatch => {
  dispatch({
    type: Actions.REFRESH_USER_TOKEN,
    api: {
      path: "tokens",
      method: "POST"
    }
  });
};
