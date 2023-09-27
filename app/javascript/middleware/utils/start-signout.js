import { setPendingUserLogin } from "../../components/connectivity/action-creators";
import { signOut } from "../../components/login/components/idp-selection";
import { Actions, attemptSignout, showLoginDialog } from "../../components/user";
import { IS_AUTHENTICATED_PATH } from "../constants";

import isOnline from "./is-online";

export default (store, logout = false) => {
  const state = store.getState();
  const usingIdp = state.getIn(["idp", "use_identity_provider"], false);
  const isAuthenticated = state.getIn(IS_AUTHENTICATED_PATH, false);
  const appLoading = state.getIn(["application", "loading"], false);
  const online = isOnline(store);

  if (online) {
    if (isAuthenticated && !logout && !appLoading) {
      store.dispatch(setPendingUserLogin(true));
      store.dispatch(showLoginDialog());
    }

    if (logout || appLoading) {
      if (usingIdp) {
        signOut();
      }

      store.dispatch(attemptSignout());
    }
  } else {
    localStorage.clear();
    sessionStorage.clear();
    store.dispatch({ type: Actions.LOGOUT_SUCCESS });
  }
};
