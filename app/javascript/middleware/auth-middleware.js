import {
  attemptSignout,
  LOGOUT_FINISHED,
  setAuthenticatedUser
} from "components/user";
import { LOGIN_SUCCESS_CALLBACK } from "components/pages/login";
import get from "lodash/get";
import { push } from "connected-react-router";

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
    store.dispatch(push("/dashboard"));
  }

  if (action.type === LOGIN_SUCCESS_CALLBACK) {
    const { user_name: username, token, id } = action.payload.json;

    localStorage.setItem("user", JSON.stringify({ token, username, id }));
    store.dispatch(setAuthenticatedUser({ username, token, id }));
    store.dispatch(push("/dashboard"));
  }

  if (action.type === LOGOUT_FINISHED) {
    localStorage.removeItem("user");
    store.dispatch(push("/login"));
  }

  if (routeChanged) {
    if (location !== "/login" && !isAuthenticated) {
      store.dispatch(push("/login"));
    }
  }

  next(action);
};

export default authMiddleware;
