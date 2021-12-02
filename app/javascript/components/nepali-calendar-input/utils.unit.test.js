import { convertToNeDate } from "./utils";

describe("components/nepali-calendar-input/utils.js", () => {
  describe("convertToNeDate", () => {
    const isoDate = "2010-01-05T18:30:00Z";

    const expected = {
      en: "2066-09-21",
      ne: "२०६६-००९-२१",
      time: new Date(isoDate)
    };

    it("converts iso dates", () => {
      expect(convertToNeDate(isoDate)).to.deep.equals(expected);
    });

    it("converts native date object", () => {
      expect(convertToNeDate(new Date(isoDate))).to.deep.equals(expected);
    });

    it("returns empty object", () => {
      expect(convertToNeDate()).to.deep.equals({});
    });
  });
});
