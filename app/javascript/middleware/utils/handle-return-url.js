import { setReturnUrl } from "../../components/application/action-creators";
import { ROUTES } from "../../config";

import isAuthenticated from "./is-authenticated";
import redirectTo from "./redirect-to";

const handleReturnUrl = (store, location) => {
  if (isAuthenticated(store)) {
    const returnUrl = store.getState().getIn(["application", "returnUrl"]);

    if (returnUrl) {
      redirectTo(store, returnUrl);
      store.dispatch(setReturnUrl(""));
    } else {
      redirectTo(store, ROUTES.dashboard);
    }
  } else {
    if (![ROUTES.login, "/"].includes(location)) {
      store.dispatch(setReturnUrl(location));
    }
    redirectTo(store, ROUTES.login);
  }
};

export default handleReturnUrl;
