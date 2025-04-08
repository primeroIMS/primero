// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import formatColumns from "./format-columns";

describe("<Report /> - utils", () => {
  describe("formatColumns", () => {
    it("return columns using the age range order", () => {
      const keys = [["6 - 11"], ["0 - 5"]];
      const columns = [{ display_name: { en: "Age" }, name: "age", position: { type: "vertical", order: 0 } }];
      const i18n = { t: value => value, locale: "en" };

      expect(formatColumns(keys, columns, ["0 - 5", "6 - 11"], true, i18n)).toEqual([
        ["0 - 5", "6 - 11", "report.total"]
      ]);
    });
  });
});
