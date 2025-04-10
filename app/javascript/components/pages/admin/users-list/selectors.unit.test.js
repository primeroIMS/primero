// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

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
      const expected = stateWithHeaders.getIn(["user", "listHeaders", NAMESPACE]);

      const headers = selectListHeaders(stateWithHeaders, NAMESPACE);

      expect(headers).toEqual(expected);
    });

    it("should return empty object when list headers empty", () => {
      const headers = selectListHeaders(stateWithoutHeaders, NAMESPACE);

      expect(headers).toEqual(fromJS([]));
    });
  });
});
