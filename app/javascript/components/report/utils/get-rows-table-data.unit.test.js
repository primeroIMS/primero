import getRowsTableData from "./get-rows-table-data";

describe("report/utils/get-rows-table-data", () => {
  describe("getRowsTableData", () => {
    it("should return the correct rows if the data is not in english", () => {
      const i18n = {
        t: value => (value === "report.total" ? "Gesamt" : value)
      };
      const data = {
        fields: [{ name: "Sex", position: { type: "horizontal" } }],
        report_data: {
          Weiblich: { Gesamt: 5 }
        }
      };

      expect(getRowsTableData(data, ["Gesamt"], i18n)).to.deep.equal([["Weiblich", false, 5]]);
    });

    it("returns the rows for multiple attributes", () => {
      const i18n = {
        t: value => (value === "report.total" ? "_total" : value)
      };
      const data = {
        fields: [
          {
            name: "risk_level",
            display_name: {
              en: "Risk Level"
            },
            position: {
              type: "horizontal",
              order: 0
            }
          },
          {
            name: "protection_concerns",
            display_name: {
              en: "Protection Concerns"
            },
            position: {
              type: "horizontal",
              order: 1
            }
          },
          {
            name: "sex",
            display_name: { en: "Sex" },
            position: {
              type: "vertical",
              order: 0
            }
          },
          {
            name: "age",
            display_name: { en: "Sex" },
            position: {
              type: "vertical",
              order: 0
            }
          }
        ],
        report_data: {
          high: {
            abandonment: {
              female: {
                "0 - 5": {
                  _total: 0
                },
                "6 - 11": {
                  _total: 0
                },
                _total: 0
              },
              male: {
                "0 - 5": {
                  _total: 0
                },
                "6 - 11": {
                  _total: 0
                },
                _total: 0
              },
              _total: 0
            },
            _total: 0
          },
          low: {
            gbv_survivor: {
              female: {
                "0 - 5": {
                  _total: 1
                },
                "6 - 11": {
                  _total: 1
                },
                _total: 2
              },
              male: {
                "0 - 5": {
                  _total: 0
                },
                "6 - 11": {
                  _total: 0
                },
                _total: 0
              },
              _total: 2
            },
            _total: 2
          }
        }
      };
      const columns = [
        {
          items: ["female", "male", "_total"],
          colspan: 3
        },
        {
          items: ["0 - 5", "6 - 11", "_total"],
          colspan: 0
        }
      ];

      expect(getRowsTableData(data, columns, i18n)).to.deep.equal([
        ["high", true, 0],
        ["abandonment", false, 0, 0, 0, 0, 0, 0, 0],
        ["low", true, 2],
        ["gbv_survivor", false, 1, 1, 2, 0, 0, 0, 2]
      ]);
    });
  });
});
