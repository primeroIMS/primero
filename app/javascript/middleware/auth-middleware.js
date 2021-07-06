import get from "lodash/get";

import { actions } from "../components/login/components/login-form";
import { Actions } from "../components/user";
import { ROUTES } from "../config";

import {
  LOGIN_PATTERN,
  RESET_PATTERN,
  ROOT_ROUTE,
  IS_AUTHENTICATED_PATH,
  USE_IDENTITY_PROVIDER_PATH,
  LOCATION_CHANGED_ACTION
} from "./constants";
import {
  startSignout,
  handleReturnUrl,
  redirectTo,
  loginSuccessHandler,
  logoutSuccessHandler,
  isOnline
} from "./utils";

const authMiddleware = store => next => action => {
  const state = store.getState();
  const online = isOnline(store);
  const routeChanged = action.type === LOCATION_CHANGED_ACTION;
  const location = routeChanged && get(action, "payload.location.pathname", false);
  const isAuthenticated = state.getIn(IS_AUTHENTICATED_PATH, false);
  const useIdentityProvider = state.getIn(USE_IDENTITY_PROVIDER_PATH, false);

  if (routeChanged && location === ROUTES.logout) {
    startSignout(store);
  }

  if ([ROUTES.login, ROOT_ROUTE].includes(location) && isAuthenticated) {
    redirectTo(store, ROUTES.dashboard);
  }

  if ([actions.LOGIN_SUCCESS_CALLBACK, Actions.RESET_PASSWORD_SUCCESS].includes(action.type)) {
    loginSuccessHandler(store, action?.payload?.json || action?.payload);
  }

  if (
    [Actions.LOGOUT_FINISHED, Actions.LOGOUT_FAILURE].includes(action.type) ||
    (Actions.LOGOUT === action.type && !online)
  ) {
    logoutSuccessHandler(store);
  }

  if (RESET_PATTERN.test(location) && useIdentityProvider) {
    redirectTo(store, isAuthenticated ? ROUTES.dashboard : ROUTES.login);
  } else if (routeChanged && !LOGIN_PATTERN.test(location) && !RESET_PATTERN.test(location) && !isAuthenticated) {
    handleReturnUrl(store, location);
  }

  next(action);
};

export default authMiddleware;
