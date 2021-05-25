import { format } from "date-fns";

import * as utils from "./utils";

describe("<IndexFitlers>/components/filter-types/<DateFilter> - utils", () => {
  describe("getDateValue", () => {
    it("returns the date if the value is an array", () => {
      const expected = "2021-02-05";
      const dateValue = utils.getDateValue("from", ["2021-02-05..2021-02-10"]);

      expect(format(dateValue, "yyyy-MM-dd")).to.equal(expected);
    });

    it("returns the date if the value is an object", () => {
      const expected = "2021-02-05";
      const dateValue = utils.getDateValue("from", { from: "2021-02-05" });

      expect(format(dateValue, "yyyy-MM-dd")).to.equal(expected);
    });
  });
});
