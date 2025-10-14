// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ROUTES } from "../../config";

import isIdentifiedUser from "./is-identified-user";
import isAuthenticated from "./is-authenticated";
import redirectTo from "./redirect-to";

const handleReturnUrl = (store, location) => {
  if (isAuthenticated(store)) {
    const returnUrl = localStorage.getItem("returnUrl");

    if (returnUrl) {
      redirectTo(store, returnUrl);
      localStorage.removeItem("returnUrl");
    } else {
      const redirectPath = isIdentifiedUser(store) ? ROUTES.my_case : ROUTES.dashboard;

      redirectTo(store, redirectPath);
    }
  } else {
    if (![ROUTES.login, "/"].includes(location)) {
      localStorage.setItem("returnUrl", location);
    }
    redirectTo(store, ROUTES.login);
  }
};

export default handleReturnUrl;
