// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setPendingUserLogin } from "../../components/connectivity/action-creators";
import { signOut } from "../../components/login/components/idp-selection";
import { attemptSignout, showLoginDialog } from "../../components/user";
import { IS_AUTHENTICATED_PATH } from "../constants";

export default (store, logout = false) => {
  const state = store.getState();
  const usingIdp = state.getIn(["idp", "use_identity_provider"], false);
  const isAuthenticated = state.getIn(IS_AUTHENTICATED_PATH, false);
  const appLoading = state.getIn(["application", "loading"], false);

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
};
