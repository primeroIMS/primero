import getSubColumnItems from "./get-sub-column-items";

describe("<InsightsSubReport />/utils/getSubColumnItems", () => {
  const subcolumnsLookups = [{ id: "boys" }, { id: "girls" }];

  context("when subcolumnsLookups and valueKey is present", () => {
    it("return an array of ids", () => {
      const result = getSubColumnItems("perpetrators", subcolumnsLookups);

      expect(result).to.deep.equals(["boys", "girls"]);
    });
  });
  context("when valueKey is NOT present in INSIGHTS_WITH_SUBCOLUMNS_ITEMS", () => {
    it("return an array of ids", () => {
      const result = getSubColumnItems("random_subreport", subcolumnsLookups);

      expect(result).to.be.null;
    });
  });
});
