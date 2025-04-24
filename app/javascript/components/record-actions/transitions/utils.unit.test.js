// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as utils from "./utils";

describe("components/record-actions/transitions/utils.js", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["filterUsers"].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("filterUsers", () => {
    const users = fromJS([{ user_name: "user_1" }, { user_name: "user_2" }, { user_name: "user_3" }]);

    const mode = {
      isShow: true
    };

    const record = fromJS({
      id: 1,
      owned_by: "user_2"
    });

    describe("when excludeOwner is true", () => {
      it("should exclude owner from users list", () => {
        const expected = [
          { label: "user_1", value: "user_1" },
          { label: "user_3", value: "user_3" }
        ];

        expect(utils.filterUsers(users, mode, record, true)).toEqual(expected);
      });
    });

    describe("when excludeOwner is false", () => {
      it("should not exclude owner from users list", () => {
        const expected = [
          { label: "user_1", value: "user_1" },
          { label: "user_2", value: "user_2" },
          { label: "user_3", value: "user_3" }
        ];

        expect(utils.filterUsers(users, mode, record)).toEqual(expected);
      });
    });
  });
});
