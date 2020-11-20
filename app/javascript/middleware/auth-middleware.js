import { push } from "connected-react-router";
import get from "lodash/get";

import { actions } from "../components/login/components/login-form";
import { signOut } from "../components/login/components/idp-selection";
import { Actions, attemptSignout, setAuthenticatedUser } from "../components/user";
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

  if (routeChanged && location === "/logout") {
    startSignout(store, attemptSignout, signOut);
  }

  if (["/login", "/"].includes(location) && isAuthenticated) {
    redirectTo(store, ROUTES.dashboard);
  }

  if (action.type === actions.LOGIN_SUCCESS_CALLBACK) {
    loginSuccessHandler(store, action.payload.json);
  }

  if ([Actions.LOGOUT_FINISHED, Actions.LOGOUT_FAILURE].includes(action.type)) {
    logoutSuccessHandler(store);
  }

  const searchPattern = /^\/login/;

  if (routeChanged && !searchPattern.test(location) && !isAuthenticated) {
    redirectTo(store, "/login");
  }

  next(action);
};

export default authMiddleware;
