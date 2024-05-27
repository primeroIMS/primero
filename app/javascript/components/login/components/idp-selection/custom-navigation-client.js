// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { NavigationClient } from "@azure/msal-browser";

class CustomNavigationClient extends NavigationClient {
  constructor(history) {
    super();
    this.history = history;
  }

  async navigateInternal(url, options) {
    const relativePath = url.replace(window.location.origin, "");

    if (options.noHistory) {
      this.history(relativePath, { replace: true });
    } else {
      this.history(relativePath);
    }

    return false;
  }
}

export default CustomNavigationClient;
