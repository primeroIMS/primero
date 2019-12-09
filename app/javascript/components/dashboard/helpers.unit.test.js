import { expect } from "../../test";

import { buildFilter } from "./helpers";

describe("<Dashboard /> - Helpers", () => {
  describe("toData1D", () => {
    it("should convert data to plain JS", () => {
      const expected = {
        owned_by: ["primero"],
        record_state: ["true"],
        status: ["open"],
        workflow: ["care_plan"]
      };

      const queryValues = [
        "owned_by=primero",
        "record_state=true",
        "status=open",
        "workflow=care_plan"
      ];

      expect(buildFilter(queryValues)).to.deep.equal(expected);
    });
  });
});
