import { buildAssociatedViolationsKeys } from "./utils";

describe("buildCollapsedFields", () => {
  context("when field is not individual_victims", () => {
    it("should return null", () => {
      const result = buildAssociatedViolationsKeys({}, []);

      expect(result).to.deep.equal([]);
    });
  });

  context("when field is individual_victims", () => {
    it("should return the values for subform", () => {
      const result = buildAssociatedViolationsKeys(
        {
          killing: [1],
          maiming: [2, 3],
          denials: [5, 6, 7]
        },
        [1, 3]
      );

      expect(result).to.deep.equal(["killing", "maiming"]);
    });
  });
});
