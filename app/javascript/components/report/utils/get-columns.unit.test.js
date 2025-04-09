// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getColumns from "./get-columns";

describe("<Report /> - utils", () => {
  describe("getColumns", () => {
    it("returns an array of columns", () => {
      const data = {
        row1: {
          total: 1,
          column1: {
            total: 1
          }
        },
        row2: {
          total: 2,
          column2: {
            total: 2
          }
        }
      };
      const totalLabel = "total";
      const qtyColumns = 1;
      const qtyRows = 1;

      expect(getColumns(data, totalLabel, qtyColumns, qtyRows)).toEqual(["column1", "column2"]);
    });

    it("returns an array of columns for the first level of nesting", () => {
      const data = {
        row1: {
          total: 1,
          row11: {
            total: 1,
            column1: {
              total: 1,
              column11: {
                total: 1
              }
            }
          }
        },
        row2: {
          total: 1,
          row21: {
            total: 1,
            column2: {
              total: 1,
              column21: {
                total: 1
              }
            }
          }
        }
      };
      const totalLabel = "total";
      const qtyColumns = 2;
      const qtyRows = 2;

      expect(getColumns(data, totalLabel, qtyColumns, qtyRows)).toEqual(["column1", "column2"]);
    });
  });
});
