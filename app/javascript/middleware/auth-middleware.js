import {
  attemptSignout,
  LOGOUT_FINISHED,
  setAuthenticatedUser
} from "components/user";
import { LOGIN_SUCCESS_CALLBACK } from "components/pages/login";
import get from "lodash/get";
import { push } from "connected-react-router";

function redirectTo(store, path) {
  store.dispatch(push(path));
}

function logoutSuccessHandler(store) {
  localStorage.removeItem("user");
  redirectTo(store, "/login");
}

function loginSuccessHandler(store, user) {
  const { user_name: username, id } = user;

  localStorage.setItem("user", JSON.stringify({ username, id }));
  store.dispatch(setAuthenticatedUser({ username, id }));
  redirectTo(store, "/dashboard");
}

const authMiddleware = store => next => action => {
  const routeChanged = action.type === "@@router/LOCATION_CHANGE";

  const location =
    routeChanged && get(action, "payload.location.pathname", false);

  const isAuthenticated = store
    .getState()
    .getIn(["user", "isAuthenticated"], false);

  if (routeChanged && location === "/logout") {
    store.dispatch(attemptSignout());
  }

  if (location === "/login" && isAuthenticated) {
    redirectTo(store, "/dashboard");
  }

  if (action.type === LOGIN_SUCCESS_CALLBACK) {
    loginSuccessHandler(store, action.payload.json);
  }

  if (action.type === LOGOUT_FINISHED) logoutSuccessHandler(store);

  if (routeChanged && location !== "/login" && !isAuthenticated) {
    redirectTo(store, "/login");
  }

  next(action);
};

export default authMiddleware;
