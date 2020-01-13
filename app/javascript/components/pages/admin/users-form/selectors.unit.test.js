import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";
import NAMESPACE from "../namespace";

import { getUser } from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    users: {
      selectedUser: { id: 1 }
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<UsersForm /> - Selectors", () => {
  describe("getUser", () => {
    it("should return selected user", () => {
      const expected = stateWithHeaders.getIn([
        "records",
        NAMESPACE,
        "selectedUser"
      ]);

      const user = getUser(stateWithHeaders);

      expect(user).to.deep.equal(expected);
    });

    it("should return empty object when selected user empty", () => {
      const user = getUser(stateWithoutHeaders);

      expect(user).to.deep.equal(fromJS({}));
    });
  });
});
