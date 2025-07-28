// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { format } from "date-fns";

import * as utils from "./utils";

describe("<IndexFitlers>/components/filter-types/<DateFilter> - utils", () => {
  describe("getDateValue", () => {
    it("returns the date if the value is an array", () => {
      const expected = "2021-02-05";
      const dateValue = utils.getDateValue("from", ["2021-02-05..2021-02-10"]);

      expect(format(dateValue, "yyyy-MM-dd")).toBe(expected);
    });

    it("returns the date if the value is an object", () => {
      const expected = "2021-02-05";
      const dateValue = utils.getDateValue("from", { from: "2021-02-05" });

      expect(format(dateValue, "yyyy-MM-dd")).toBe(expected);
    });
  });

  describe("getValueSelectedField", () => {
    it("returns value selected", () => {
      const options = {
        en: [
          { id: "opt1", display_name: "Option 1" },
          { id: "opt2", display_name: "Option 12" }
        ]
      };
      const initialFilters = { another: "value" };
      const getValues = () => {
        return { opt1: "Option 1" };
      };

      expect(utils.getValueSelectedField(options, "en", initialFilters, getValues)).toBe("opt1");
    });
  });
});
