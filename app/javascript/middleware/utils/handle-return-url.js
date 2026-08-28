import { ROUTES, SKIP_LOGIN_REDIRECTION_ROUTES } from "../../config";

import isAuthenticated from "./is-authenticated";
import redirectTo from "./redirect-to";

const handleReturnUrl = (store, location) => {
  if (isAuthenticated(store)) {
    const returnUrl = localStorage.getItem("returnUrl");

    if (returnUrl) {
      redirectTo(store, returnUrl);
      localStorage.removeItem("returnUrl");
    } else {
      redirectTo(store, ROUTES.dashboard);
    }
  } else {
    if (![ROUTES.login, "/"].includes(location)) {
      localStorage.setItem("returnUrl", location);
    }

    if (SKIP_LOGIN_REDIRECTION_ROUTES.some(route => location.startsWith(route))) return;

    redirectTo(store, ROUTES.login);
  }
};

export default handleReturnUrl;
