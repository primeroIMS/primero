// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildGraphData from "./build-graph-data";

describe("<Report /> - utils", () => {
  describe("buildGraphData", () => {
    it("should convert data to string", () => {
      const report = fromJS({
        editable: false,
        record_type: "case",
        name: {
          en: "Cases by Agency CP"
        },
        graph_type: "bar",
        graph: true,
        module_id: ["primeromodule-cp"],
        group_dates_by: "date",
        group_ages: false,
        report_data: {
          agency1: {
            _total: 1
          },
          agency2: {
            _total: 43
          }
        },
        fields: [
          {
            name: "owned_by_agency_id",
            display_name: {
              en: "Case Manager's Agency"
            },
            position: {
              type: "horizontal",
              order: 0
            },
            option_strings_source: "Agency"
          }
        ],
        id: 148,
        filters: [
          {
            value: ["open"],
            attribute: "status"
          },
          {
            value: ["true"],
            attribute: "record_state"
          },
          {
            attribute: "owned_by_groups",
            value: ["usergroup-primero-cp"]
          }
        ],
        disabled: false,
        description: {
          en: "Number of cases broken down by agency"
        }
      });
      const i18n = {
        t: x => x,
        locale: "en"
      };
      const agencies = [
        {
          id: "agency1",
          display_text: "agency1"
        },
        {
          id: "agency2",
          display_text: "agency2"
        }
      ];
      const expected = {
        description: "Number of cases broken down by agency",
        data: {
          labels: ["agency1", "agency2"],
          datasets: [
            {
              backgroundColor: "#e0dfd6",
              data: [1, 43],
              label: "report.total"
            }
          ]
        }
      };

      expect(buildGraphData(report, i18n, { agencies, ageRanges: [] })).toEqual(expected);
    });
  });

  it("generates the graph data", () => {
    const report = fromJS({
      id: 18,
      name: { en: "Protection Concerns by Risk Level" },
      description: { en: "Protection Concerns by Risk Level" },
      graph: true,
      graph_type: "bar",
      exclude_empty_rows: true,
      record_type: "case",
      module_id: "primeromodule-cp",
      group_dates_by: "date",
      group_ages: false,
      editable: true,
      disabled: false,
      filters: [
        {
          value: ["open"],
          attribute: "status"
        },
        {
          value: ["true"],
          attribute: "record_state"
        }
      ],
      fields: [
        {
          name: "protection_concerns",
          display_name: { en: "Protection Concerns" },
          position: {
            type: "horizontal",
            order: 0
          },
          option_labels: {
            en: [
              {
                id: "rape",
                display_text: "Rape"
              },
              {
                id: "neglect",
                display_text: "Neglect"
              },
              {
                id: "abandonment",
                display_text: "Abandonment"
              },
              {
                id: "unaccompanied",
                display_text: "Unaccompanied"
              },
              {
                id: "separated",
                display_text: "Separated"
              },
              {
                id: "orphan",
                display_text: "Orphan"
              },
              {
                id: "other",
                display_text: "Other"
              }
            ]
          }
        },
        {
          name: "risk_level",
          display_name: {
            en: "Risk Level"
          },
          position: {
            type: "vertical",
            order: 0
          },
          option_labels: {
            en: [
              {
                id: "high",
                display_text: "High"
              },
              {
                id: "medium",
                display_text: "Medium"
              },
              {
                id: "low",
                display_text: "Low"
              }
            ]
          }
        }
      ],
      report_data: {
        abandonment: {
          low: {
            _total: 2
          },
          _total: 2
        },
        neglect: {
          low: {
            _total: 1
          },
          _total: 1
        },
        orphan: {
          low: {
            _total: 1
          },
          _total: 1
        },
        rape: {
          high: {
            _total: 1
          },
          _total: 1
        },
        separated: {
          low: {
            _total: 1
          },
          _total: 1
        },
        unaccompanied: {
          low: {
            _total: 1
          },
          _total: 1
        }
      }
    });

    const i18n = { t: x => x, locale: "en" };

    const expected = {
      description: "Protection Concerns by Risk Level",
      data: {
        labels: ["Rape", "Neglect", "Abandonment", "Unaccompanied", "Separated", "Orphan"],
        datasets: [
          {
            backgroundColor: "#e0dfd6",
            data: [1, 0, 0, 0, 0, 0],
            label: "High"
          },
          {
            backgroundColor: "#595951",
            data: [0, 1, 2, 1, 1, 1],
            label: "Low"
          }
        ]
      }
    };

    expect(buildGraphData(report, i18n, { agencies: [], ageRanges: [] })).toEqual(expected);
  });
});
