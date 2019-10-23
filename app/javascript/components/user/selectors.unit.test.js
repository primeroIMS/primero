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
  describe("hasUserPermissions", () => {
    it("should return if user has permissions", () => {
      const selector = selectors.hasUserPermissions(stateWithUser);
      expect(selector).to.equal(true);
    });

    it("should return false if permissions not set", () => {
      const selector = selectors.hasUserPermissions(stateWithNoUser);
      expect(selector).to.equal(false);
    });
  });
});
