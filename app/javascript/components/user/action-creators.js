import { DB } from "config";
import { loadApplicationResources } from "components/application";
import ApplicationActions from "components/application/actions";
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
        collection: DB.USER
      }
    }
  });
};

export const setAppSettingsFetched = payload => async dispatch => {
  dispatch({
    type: ApplicationActions.APP_SETTINGS_FETCHED,
    payload
  });
};

export const setAuthenticatedUser = user => async dispatch => {
  await dispatch(setUser(user));

  await dispatch(setAppSettingsFetched(false));

  Promise.all([
    dispatch(fetchAuthenticatedUserData(user.id)),
    dispatch(loadApplicationResources())
  ]);
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
