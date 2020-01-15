import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";
import NAMESPACE from "../namespace";

import { selectListHeaders } from "./selectors";

const stateWithHeaders = fromJS({
  user: {
    listHeaders: {
      users: [{ id: 1 }, { id: 2 }]
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<UsersList /> - Selectors", () => {
  describe("selectListHeaders", () => {
    it("should return list headers", () => {
      const expected = stateWithHeaders.getIn([
        "user",
        "listHeaders",
        NAMESPACE
      ]);

      const headers = selectListHeaders(stateWithHeaders, NAMESPACE);

      expect(headers).to.deep.equal(expected);
    });

    it("should return empty object when list headers empty", () => {
      const headers = selectListHeaders(stateWithoutHeaders, NAMESPACE);

      expect(headers).to.deep.equal(fromJS([]));
    });
  });
});
