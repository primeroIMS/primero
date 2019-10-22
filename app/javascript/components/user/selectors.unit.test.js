import chai, { expect } from "chai";
import { fromJS } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoUser = fromJS({});
const stateWithUser = fromJS({
  user: {
    permissions: {
      incidents: ["manage"],
      tracing_requests: ["manage"],
      cases: ["manage"]
    }
  }
});

describe("User - Selectors", () => {
  describe("selectHasUserPermissions", () => {
    it("should return if user has permissions", () => {
      const selector = selectors.selectHasUserPermissions(stateWithUser);
      expect(selector).to.equal(true);
    });

    it("should return false if permissions not set", () => {
      const selector = selectors.selectHasUserPermissions(stateWithNoUser);
      expect(selector).to.equal(false);
    });
  });
});
