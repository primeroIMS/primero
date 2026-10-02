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

      expect(getRowsTableData(data, ["Gesamt"], [], i18n)).toEqual([["Weiblich", false, { count: 5 }]]);
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

      expect(getRowsTableData(data, columns, [], i18n)).toEqual([
        ["high", true, { count: 0 }],
        [
          "abandonment",
          false,
          { count: 0, query: [] },
          { count: 0, query: [] },
          { count: 0, query: [] },
          { count: 0, query: [] },
          { count: 0, query: [] },
          { count: 0, query: [] },
          { count: 0 }
        ],
        ["low", true, { count: 2 }],
        [
          "gbv_survivor",
          false,
          { count: 1, query: [] },
          { count: 1, query: [] },
          { count: 2, query: [] },
          { count: 0, query: [] },
          { count: 0, query: [] },
          { count: 0, query: [] },
          { count: 2 }
        ]
      ]);
    });
  });

  it("returns the rows following the option_labels order", () => {
    const i18n = {
      t: value => (value === "report.total" ? "_total" : value),
      locale: "en"
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
          },
          option_labels: {
            en: [
              { id: "high", display_text: "high" },
              { id: "medium", display_text: "medium" },
              { id: "low", display_text: "low" }
            ]
          }
        },
        {
          name: "sex",
          display_name: { en: "Sex" },
          position: {
            type: "vertical",
            order: 0
          },
          option_labels: {
            en: [
              { id: "female", display_text: "female" },
              { id: "male", display_text: "male" },
              { id: "other", display_text: "other" }
            ]
          }
        }
      ],
      report_data: {
        high: {
          female: {
            _total: 1
          },
          _total: 1
        },
        low: {
          male: {
            _total: 1
          },
          _total: 1
        },
        medium: {
          other: {
            _total: 1
          },
          _total: 1
        }
      }
    };
    const columns = ["female", "male", "other", "_total"];

    expect(getRowsTableData(data, columns, [], i18n)).toEqual([
      ["high", false, { count: 1, query: [] }, { count: 0, query: [] }, { count: 0, query: [] }, { count: 1 }],
      [
        "medium",
        false,
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 1, query: [] },
        { count: 1 }
      ],
      ["low", false, { count: 0, query: [] }, { count: 1, query: [] }, { count: 0, query: [] }, { count: 1 }]
    ]);
  });

  it("returns the rows in order for multiple attributes", () => {
    const i18n = {
      t: value => (value === "report.total" ? "_total" : value),
      locale: "en"
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
          },
          option_labels: {
            en: [
              { id: "high", display_text: "high" },
              { id: "medium", display_text: "medium" },
              { id: "low", display_text: "low" }
            ]
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
          },
          option_labels: {
            en: [
              { id: "abandoment", display_text: "abandoment" },
              { id: "neglect", display_text: "neglect" },
              { id: "gbv_survivor", display_text: "gbv_survivor" }
            ]
          }
        },
        {
          name: "sex",
          display_name: { en: "Sex" },
          position: {
            type: "vertical",
            order: 0
          },
          option_labels: {
            en: [
              { id: "female", display_text: "female" },
              { id: "male", display_text: "male" },
              { id: "other", display_text: "other" }
            ]
          }
        },
        {
          name: "age",
          display_name: { en: "Age" },
          position: {
            type: "vertical",
            order: 0
          }
        }
      ],
      group_ages: true,
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
        },
        medium: {
          neglect: {
            female: {
              "0 - 5": {
                _total: 0
              },
              "6 - 11": {
                _total: 1
              },
              _total: 1
            },
            male: {
              "0 - 5": {
                _total: 1
              },
              "6 - 11": {
                _total: 0
              },
              _total: 1
            },
            _total: 2
          },
          abandonment: {
            female: {
              "0 - 5": {
                _total: 1
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
            _total: 1
          },
          _total: 3
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

    expect(getRowsTableData(data, columns, [], i18n)).toEqual([
      ["high", true, { count: 0 }],
      [
        "abandonment",
        false,
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0 }
      ],
      ["medium", true, { count: 3 }],
      [
        "abandonment",
        false,
        { count: 1, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 1 }
      ],
      [
        "neglect",
        false,
        { count: 0, query: [] },
        { count: 1, query: [] },
        { count: 1, query: [] },
        { count: 1, query: [] },
        { count: 0, query: [] },
        { count: 1, query: [] },
        { count: 2 }
      ],
      ["low", true, { count: 2 }],
      [
        "gbv_survivor",
        false,
        { count: 1, query: [] },
        { count: 1, query: [] },
        { count: 2, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 0, query: [] },
        { count: 2 }
      ]
    ]);
  });

  it("return the rows for a display_text with dots", () => {
    const i18n = {
      t: value => (value === "report.total" ? "_total" : value),
      locale: "en"
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
          },
          option_labels: {
            en: [
              { id: "high", display_text: "high" },
              { id: "medium", display_text: "medium" },
              { id: "low", display_text: "low" }
            ]
          }
        },
        {
          name: "protection_concerns",
          display_name: {
            en: "Protection Concerns"
          },
          position: {
            type: "vertical",
            order: 1
          },
          option_labels: {
            en: [
              { id: "abandoment", display_text: "abandoment" },
              { id: "neglect", display_text: "neglect" },
              { id: "security.e.g_safe_shelter", display_text: "security.e.g_safe_shelter" }
            ]
          }
        }
      ],
      report_data: {
        high: {
          abandoment: { _total: 1 },
          neglect: { _total: 1 },
          "security.e.g_safe_shelter": { _total: 2 },
          _total: 4
        }
      }
    };
    const columns = ["abandoment", "neglect", "security.e.g_safe_shelter", "_total"];

    expect(getRowsTableData(data, columns, [], i18n)).toEqual([
      ["high", false, { count: 1, query: [] }, { count: 1, query: [] }, { count: 2, query: [] }, { count: 4 }]
    ]);
  });
});
