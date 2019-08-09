import {
  loadResources,
  attemptSignout,
  LOGIN_SUCCESS_CALLBACK,
  LOGOUT_FINISHED
} from "components/pages/login";
import { push } from "connected-react-router";
import get from "lodash/get";

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
    const { user_name: username, token } = action.payload.json;
    localStorage.setItem("jwt", token);
    localStorage.setItem("username", username);
    store.dispatch(loadResources());
    store.dispatch(push("/dashboard"));
  }

  if (action.type === LOGOUT_FINISHED) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
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
