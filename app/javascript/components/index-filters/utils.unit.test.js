import { compactFilters } from "./utils";

describe("<IndexFilters /> - Utils", () => {
  describe("compactFilters()", () => {
    it("returns compacted object", () => {
      const expected = {
        filter2: true,
        filter4: ["open"],
        filter6: { option1: "option1" }
      };

      const values = {
        filter1: false,
        filter2: true,
        filter3: [],
        filter4: ["open"],
        filter5: {},
        filter6: { option1: "option1" }
      };

      expect(compactFilters(values)).to.deep.equal(expected);
    });
  });
});
