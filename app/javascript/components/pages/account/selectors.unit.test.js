import { fromJS } from "immutable";

import NAMESPACE from "./namespace";
import { getCurrentUser, getSavingRecord } from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    account: {
      user: { id: 1 },
      errors: true,
      serverErrors: [{ message: "error-1" }],
      saving: true
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("pages/account/selectors.js", () => {
  describe("getCurrentUser", () => {
    it("should return selected user", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "user"]);

      const user = getCurrentUser(stateWithHeaders);

      expect(user).to.deep.equal(expected);
    });

    it("should return empty object when selected user empty", () => {
      const user = getCurrentUser(stateWithoutHeaders);

      expect(user).to.deep.equal(fromJS({}));
    });
  });

  describe("getSavingRecord", () => {
    it("should return server errors", () => {
      const serverErrors = getSavingRecord(stateWithHeaders);

      expect(serverErrors).to.be.true;
    });

    it("should return empty object when no server errors", () => {
      const user = getSavingRecord(stateWithoutHeaders);

      expect(user).to.be.false;
    });
  });
});
