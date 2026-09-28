import { fromJS } from "immutable";

import * as utils from "./utils";

describe("<Records /> - utils", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...utils };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "cleanUpFilters",
      "useMetadata",
      "getShortIdFromUniqueId",
      "hasPendingReferral",
      "hasPendingTransfer",
      "hasPendingTransition",
      "getPendingTransitionIds",
      "userInRecordList"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).toHaveProperty(property);
        delete clone[property];
      });
    });
  });

  describe("hasPendingTransition", () => {
    it("is true when the user has a pending referral", () => {
      expect(utils.hasPendingTransition(fromJS({ referred_users_pending: ["user_1"] }), "user_1")).toBe(true);
    });

    it("is true when the user has a pending transfer", () => {
      expect(utils.hasPendingTransition(fromJS({ transferred_to_users: ["user_1"] }), "user_1")).toBe(true);
    });

    it("is false when the user has no pending transition", () => {
      expect(
        utils.hasPendingTransition(
          fromJS({ referred_users_pending: ["user_2"], transferred_to_users: ["user_3"] }),
          "user_1"
        )
      ).toBe(false);
    });
  });

  describe("getPendingTransitionIds", () => {
    const records = [
      fromJS({ id: "1", referred_users_pending: ["user_1"] }),
      fromJS({ id: "2" }),
      fromJS({ id: "3", transferred_to_users: ["user_1"] })
    ];

    it("returns the ids of the records with a pending transition for the user", () => {
      expect(utils.getPendingTransitionIds(records, "user_1")).toEqual(["1", "3"]);
    });

    it("returns an empty array when there are no records", () => {
      expect(utils.getPendingTransitionIds(undefined, "user_1")).toEqual([]);
    });
  });
});
