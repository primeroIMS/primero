// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map } from "immutable";

import * as selectors from "./selectors";

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  records: Map({
    transitions: Map({
      data: [],
      reassign: Map({
        users: [{ label: "primero_cp", value: "primero_cp" }],
        errors: true,
        message: ["Test error message"],
        loading: true
      })
    })
  })
});

describe("<Transitions /> - Selectors", () => {
  describe("getUsersByTransitionType", () => {
    it("should return list of users allowed to reassign", () => {
      const expected = [{ label: "primero_cp", value: "primero_cp" }];
      const values = selectors.getUsersByTransitionType(stateWithRecords, "reassign");

      expect(values).toEqual(expected);
    });

    it("should return empty when there are not users in store", () => {
      const errors = selectors.getUsersByTransitionType(stateWithNoRecords);

      expect(errors).toBe(fromJS([]));
    });
  });

  describe("getErrorsByTransitionType", () => {
    it("should return error messages", () => {
      const expected = ["Test error message"];
      const values = selectors.getErrorsByTransitionType(stateWithRecords, "reassign");

      expect(values).toEqual(expected);
    });

    it("should return empty list when there are not messages in store", () => {
      const errors = selectors.getErrorsByTransitionType(stateWithNoRecords);

      expect(errors).toBe(fromJS([]));
    });
  });

  describe("deprecated getMockUsers", () => {
    it("should be undefined", () => {
      expect(selectors.getMockUsers).toBeUndefined();
    });
  });

  describe("deprecated getAssignUsers", () => {
    it("should be undefined", () => {
      expect(selectors.getAssignUsers).toBeUndefined();
    });
  });

  describe("getLoadingTransitionType", () => {
    it("should return error messages", () => {
      const values = selectors.getLoadingTransitionType(stateWithRecords, "reassign");

      expect(values).toBe(true);
    });

    it("should return undefined when there are not messages in store", () => {
      const errors = selectors.getLoadingTransitionType(stateWithNoRecords, "referral");

      expect(errors).toBe(false);
    });
  });
});
