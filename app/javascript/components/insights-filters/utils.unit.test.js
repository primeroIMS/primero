import { parseISO } from "date-fns";

import { useFakeTimers } from "../../test";
import { CUSTOM, LAST_WEEK, THIS_MONTH, THIS_WEEK } from "../insights/constants";

import { dateCalculations } from "./utils";

describe("InsightFilters - utils", () => {
  describe("dateCalculations", () => {
    let clock = null;
    const { getTimezoneOffset } = Date.prototype;

    beforeEach(() => {
      const today = parseISO("2010-01-05T18:30:00Z");

      clock = useFakeTimers(today);
    });

    it("returns dates without timezone changes", () => {
      const { from, to } = dateCalculations(THIS_MONTH);

      expect(from).to.equals("2010-01-01T00:00:00Z");
      expect(to).to.equals("2010-01-31T23:59:59Z");
    });

    it("returns the same date if the date is custom", () => {
      const { from, to } = dateCalculations(CUSTOM, "2010-01-01", "2010-01-05");

      expect(from).to.equals("2010-01-01");
      expect(to).to.equals("2010-01-05");
    });

    it("returns this week", () => {
      const { from, to } = dateCalculations(THIS_WEEK);

      expect(from).to.equals("2010-01-03T00:00:00Z");
      expect(to).to.equals("2010-01-09T23:59:59Z");
    });

    it("returns last week", () => {
      const { from, to } = dateCalculations(LAST_WEEK);

      expect(from).to.equals("2009-12-27T00:00:00Z");
      expect(to).to.equals("2010-01-02T23:59:59Z");
    });

    afterEach(() => {
      // Restore original method
      // eslint-disable-next-line no-extend-native
      Date.prototype.getTimezoneOffset = getTimezoneOffset;
      clock.restore();
    });
  });
});
