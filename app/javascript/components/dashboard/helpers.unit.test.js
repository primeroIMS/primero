import { expect } from "../../test";

import { buildFilter } from "./helpers";

describe("<Dashboard /> - Helpers", () => {
  describe("toData1D", () => {
    describe("when isManager is false", () => {
      it("should convert data to string", () => {
        const expected =
          "or%5Bowned_by%5D=primero&record_state%5B0%5D=true&status%5B0%5D=open&workflow%5B0%5D=care_plan";
        const queryValues = [
          "owned_by=primero",
          "record_state=true",
          "status=open",
          "workflow=care_plan"
        ];

        expect(buildFilter(queryValues)).to.deep.equal(expected);
      });
    });

    describe("when isManager is true", () => {
      it("should convert data to string without 'or' param", () => {
        const expected =
          "owned_by%5B0%5D=primero&record_state%5B0%5D=true&status%5B0%5D=open&workflow%5B0%5D=care_plan";
        const queryValues = [
          "owned_by=primero",
          "record_state=true",
          "status=open",
          "workflow=care_plan"
        ];

        expect(buildFilter(queryValues, true)).to.deep.equal(expected);
      });
    });

    describe("when a filter has multiple values", () => {
      it("should convert data to string", () => {
        const expected =
          "record_state%5B0%5D=true&status%5B0%5D=open&status%5B1%5D=closed&workflow%5B0%5D=closed";
        const queryValues = [
          "record_state=true",
          "status=open,closed",
          "workflow=closed"
        ];

        expect(buildFilter(queryValues, true)).to.deep.equal(expected);
      });
    });
  });
});
