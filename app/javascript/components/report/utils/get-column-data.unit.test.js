// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getColumnData from "./get-column-data";

describe("<Report /> - utils", () => {
  describe("getColumnData", () => {
    it("returns the data for the column when the column is present", () => {
      const column = "Column1";
      const data = {
        Row1: { Column1: { Total: 5 }, Column2: { Total: 2 }, Total: 7 },
        Row2: { Column1: { Total: 5 }, Column2: { Total: 1 }, Total: 6 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyRows = 1;

      expect(getColumnData(column, data, i18n, qtyRows, [], { ageRanges: [] })).toEqual([5, 5]);
    });

    it("returns 0 when the column is not present", () => {
      const column = "Column1";
      const data = {
        Row1: { Column2: { Total: 2 }, Total: 7 },
        Row2: { Column1: { Total: 5 }, Column2: { Total: 1 }, Total: 6 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyRows = 1;

      expect(getColumnData(column, data, i18n, qtyRows, [], { ageRanges: [] })).toEqual([0, 5]);
    });

    it("returns 0 when the column is 0", () => {
      const column = "Column2";
      const data = {
        Row1: { Column2: { Total: 0 }, Total: 0 },
        Row2: { Column1: { Total: 5 }, Column2: { Total: 0 }, Total: 6 }
      };
      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyRows = 1;

      expect(getColumnData(column, data, i18n, qtyRows, [], { ageRanges: [] })).toEqual([0, 0]);
    });

    it("returns data for two rows", () => {
      const column = ["6 - 11"];
      const data = {
        High: {
          Abandonment: {
            "0 - 5": {
              Total: 1
            },
            Total: 1
          }
        },
        Medium: {
          Abandonment: {
            "0 - 5": {
              Total: 1
            },
            "6 - 11": {
              Total: 1
            },
            Total: 2
          },
          Rape: {
            "0 - 5": {
              Total: 2
            },
            Total: 2
          }
        },
        Low: {
          Neglect: {
            "6 - 11": {
              Total: 1
            },
            Total: 2
          }
        },
        none: {
          Total: 6
        }
      };

      const i18n = { t: key => (key === "report.total" ? "Total" : key) };
      const qtyRows = 2;

      expect(getColumnData(column, data, i18n, qtyRows, [], { ageRanges: [] })).toEqual([0, 1, 1, 0]);
    });
  });
});
