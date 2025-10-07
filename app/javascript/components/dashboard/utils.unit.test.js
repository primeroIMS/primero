// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { buildFilter } from "./utils";

describe("<Dashboard /> - Helpers", () => {
  describe("toData1D", () => {
    describe("when isManager is false", () => {
      it("should convert data to string", () => {
        const expected =
          "or%5Bowned_by%5D=primero&record_state%5B0%5D=true&status%5B0%5D=open&workflow%5B0%5D=care_plan";
        const queryValues = fromJS(["owned_by=primero", "record_state=true", "status=open", "workflow=care_plan"]);

        expect(buildFilter(queryValues)).toEqual(expected);
      });
    });

    describe("when isManager is true", () => {
      it("should convert data to string without 'or' param", () => {
        const expected =
          "owned_by%5B0%5D=primero&record_state%5B0%5D=true&status%5B0%5D=open&workflow%5B0%5D=care_plan";
        const queryValues = fromJS(["owned_by=primero", "record_state=true", "status=open", "workflow=care_plan"]);

        expect(buildFilter(queryValues, true)).toEqual(expected);
      });
    });

    describe("when a filter has multiple values", () => {
      it("should convert data to string", () => {
        const expected = "record_state%5B0%5D=true&status%5B0%5D=open&status%5B1%5D=closed&workflow%5B0%5D=closed";
        const queryValues = fromJS(["record_state=true", "status=open,closed", "workflow=closed"]);

        expect(buildFilter(queryValues, true)).toEqual(expected);
      });
    });
  });
});
