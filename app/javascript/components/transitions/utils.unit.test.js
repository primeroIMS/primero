import { RECORD_PATH } from "../../config";

import * as utils from "./utils";

describe("transitions/utils", () => {
  describe("redirectCheckAccessDenied", () => {
    it("should return the correct object", () => {
      const expected = {
        action: `cases/REDIRECT`,
        redirectWithIdFromResponse: true,
        redirectWhenAccessDenied: true,
        redirect: `/cases`
      };

      expect(utils.redirectCheckAccessDenied(RECORD_PATH.cases)).to.deep.equal(expected);
    });
  });
});
