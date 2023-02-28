import getTranslatedKey from "./get-translated-key";

describe("<Report /> - utils", () => {
  describe("getTranslatedKey", () => {
    it("returns Incomplete Data for the incomplete_data key", () => {
      const incompleteDataLabel = "Incomplete Data";

      expect(getTranslatedKey("incomplete_data", {}, { i18n: { t: () => incompleteDataLabel } })).to.equal(
        incompleteDataLabel
      );
    });
  });
});
