// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../config";

import * as utils from "./utils";

describe("transitions/utils", () => {
  describe("redirectCheckAccessDenied", () => {
    it("should return the correct object", () => {
      const expected = {
        action: `cases/REDIRECT`,
        redirectProperty: "record_id",
        redirectWhenAccessDenied: true,
        redirectWithIdFromResponse: true,
        redirect: `/cases`
      };

      expect(utils.redirectCheckAccessDenied(RECORD_PATH.cases)).toEqual(expected);
    });
  });
});
