// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ROUTES } from "../../config";

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
    redirectTo(store, ROUTES.login);
  }
};

export default handleReturnUrl;
