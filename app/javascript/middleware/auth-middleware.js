import { push } from "connected-react-router";
import get from "lodash/get";

import { actions } from "../components/login/components/login-form";
import { Actions, setAuthenticatedUser } from "../components/user";
import DB from "../db";
import { ROUTES } from "../config";
import { clearDialog } from "../components/action-dialog";
import { setPendingUserLogin } from "../components/connectivity/action-creators";

import { startSignout } from "./utils";

function redirectTo(store, path) {
  store.dispatch(push(path));
}

function logoutSuccessHandler(store) {
  localStorage.removeItem("user");
  redirectTo(store, "/login");
}

async function loginSuccessHandler(store, user) {
  const { user_name: username, id } = user;
  const pendingUserLogin = store.getState().getIn(["connectivity", "pendingUserLogin"], false);
  const userFromDB = await DB.getRecord("user", username);

  if (!userFromDB) {
    await DB.clearDB();
  }

  localStorage.setItem("user", JSON.stringify({ username, id }));
  store.dispatch(setAuthenticatedUser({ username, id }));

  if (!pendingUserLogin) {
    redirectTo(store, ROUTES.dashboard);
  }

  store.dispatch(clearDialog());
  store.dispatch(setAuthenticatedUser({ username, id }));
  store.dispatch(setPendingUserLogin(false));
}

const authMiddleware = store => next => action => {
  const routeChanged = action.type === "@@router/LOCATION_CHANGE";
  const location = routeChanged && get(action, "payload.location.pathname", false);

  const isAuthenticated = store.getState().getIn(["user", "isAuthenticated"], false);

  const useIdentityProvider = store.getState().getIn(["idp", "use_identity_provider"], false);

  if (routeChanged && location === ROUTES.logout) {
    startSignout(store);
  }

  if ([ROUTES.login, "/"].includes(location) && isAuthenticated) {
    redirectTo(store, ROUTES.dashboard);
  }

  if ([actions.LOGIN_SUCCESS_CALLBACK, Actions.RESET_PASSWORD_SUCCESS].includes(action.type)) {
    loginSuccessHandler(store, action.payload.json || action.payload);
  }

  if ([Actions.LOGOUT_FINISHED, Actions.LOGOUT_FAILURE].includes(action.type)) {
    logoutSuccessHandler(store);
  }

  const loginPattern = /^\/login/;

  const resetPattern = /^\/password_reset/;

  if (resetPattern.test(location) && useIdentityProvider) {
    redirectTo(store, isAuthenticated ? ROUTES.dashboard : ROUTES.login);
  } else if (routeChanged && !loginPattern.test(location) && !resetPattern.test(location) && !isAuthenticated) {
    redirectTo(store, ROUTES.login);
  }

  next(action);
};

export default authMiddleware;
