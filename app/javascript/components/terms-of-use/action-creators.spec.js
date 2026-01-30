// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { METHODS } from "../../config";

import actions from "./actions";
import { acceptTermsOfUse } from "./action-creators";

describe("TermsOfUse - Action Creators", () => {
  describe("acceptTermsOfUse", () => {
    const userId = 123;
    const path = "/dashboard";
    const expectedAction = acceptTermsOfUse({ userId, path });

    it("should have correct API configuration & type", () => {
      expect(expectedAction.type).toEqual(actions.ACCEPT_TERMS_OF_USE);
      expect(expectedAction.api.path).toEqual(`users/${userId}`);
      expect(expectedAction.api.method).toEqual(METHODS.PATCH);
      expect(expectedAction.api.body).toEqual({
        data: {
          accept_terms_of_use: true
        }
      });
    });
  });
});
