// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getColumnObjects from "./get-column-objects";

describe("<Report /> - utils", () => {
  describe("getColumnObjects", () => {
    it("should return the columns as object", () => {
      const reportData = {
        row_1: {
          column_1: {
            _total: 5
          },
          column_2: {
            _total: 5
          },
          _total: 10
        }
      };

      expect(getColumnObjects(reportData, 1)).toEqual({
        column_1: {
          _total: 5
        },
        column_2: {
          _total: 5
        }
      });
    });

    it("should return the columns as object when rows have different columns", () => {
      const reportData = {
        row_value_1: {
          column_1: {
            _total: 5
          },
          _total: 5
        },
        row_value_2: {
          column_2: {
            _total: 5
          },
          _total: 5
        }
      };

      expect(getColumnObjects(reportData, 1)).toEqual({
        column_1: {
          _total: 5
        },
        column_2: {
          _total: 5
        }
      });
    });

    it("should return the columns as object for 2 rows when columns and rows are different", () => {
      const reportData = {
        row_1: {
          row_1_1: {
            column_1: {
              _total: 5
            },
            _total: 5
          },
          _total: 5
        },
        row_2: {
          row_1_1: {
            column_2: {
              _total: 5
            },
            _total: 5
          },
          row_1_2: {
            column_3: {
              _total: 5
            },
            _total: 5
          },
          _total: 10
        }
      };

      expect(getColumnObjects(reportData, 2)).toEqual({
        column_1: {
          _total: 5
        },
        column_2: {
          _total: 5
        },
        column_3: {
          _total: 5
        }
      });
    });

    it("should return the columns as object when columns have missing subcolumns", () => {
      const reportData = {
        aug: {
          _total: 3,
          "0 - 5": {
            _total: 3,
            "Location - 1": {
              _total: 3,
              No: {
                _total: 1
              }
            }
          }
        },
        jan: {
          _total: 1,
          "6 - 11": {
            _total: 1,
            "Location - 1": {
              _total: 1,
              Yes: {
                _total: 1
              }
            }
          }
        },
        mar: {
          _total: 2,
          "0 - 5": {
            _total: 2,
            "Location - 1": {
              _total: 2
            }
          }
        }
      };

      expect(getColumnObjects(reportData, 2)).toEqual({
        "Location - 1": {
          _total: 2,
          Yes: {
            _total: 1
          },
          No: {
            _total: 1
          }
        }
      });
    });
  });
});
