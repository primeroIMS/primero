// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as modules from "./index";

describe("middleware/utils/index.js", () => {
  describe("known properties", () => {
    let clone;

    before(() => {
      clone = { ...modules };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "checkFieldSubformErrors",
      "defaultErrorCallback",
      "generateRecordProperties",
      "handleConfiguration",
      "handleRestCallback",
      "isOnline",
      "partitionObject",
      "processAttachments",
      "loginSuccessHandler",
      "logoutSuccessHandler",
      "startSignout",
      "retrieveData",
      "queueData",
      "queueFetch",
      "processSubforms",
      "isServerOnline",
      "handleReturnUrl",
      "isAuthenticated",
      "redirectTo",
      "userToggleOffline"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(modules).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
