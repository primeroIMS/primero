// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import toCasesToAssignTable from "./to-cases-to-assign-table";

describe("toCasesToAssignTable - pages/dashboard/utils/", () => {
  it("should convert the data for CasesToAssign", () => {
    const expected = {
      columns: [
        { label: "", name: "" },
        { label: "Level 1", name: "level_1" },
        { label: "Level 2", name: "level_2" },
        { label: "dashboard.none_risk", name: "none" }
      ],
      data: [
        { "": "dashboard.cases_to_assign", none: 0, level_1: 1, level_2: 1 },
        { "": "dashboard.overdue_cases_to_assign", none: 0, level_1: 1, level_2: 1 }
      ],
      query: [
        { level_1: ["risk_level=level_1"], level_2: ["risk_level=level_2"], none: ["not[risk_level]=level_1,level_2"] },
        { level_1: ["risk_level=level_1"], level_2: ["risk_level=level_2"], none: ["not[risk_level]=level_1,level_2"] }
      ]
    };

    const casesToAssign = fromJS({
      name: "dashboard.dash_cases_to_assign",
      type: "indicator",
      indicators: {
        cases_none: {
          count: 0,
          query: ["not[risk_level]=level_1,level_2"]
        },
        cases_level_1: {
          count: 1,
          query: ["risk_level=level_1"]
        },
        cases_level_2: {
          count: 1,
          query: ["risk_level=level_2"]
        },
        overdue_cases_none: {
          count: 0,
          query: ["not[risk_level]=level_1,level_2"]
        },
        overdue_cases_level_1: {
          count: 1,
          query: ["risk_level=level_1"]
        },
        overdue_cases_level_2: {
          count: 1,
          query: ["risk_level=level_2"]
        }
      }
    });

    const i18n = { t: value => value };

    const riskLevels = [
      { id: "level_1", display_text: "Level 1" },
      { id: "level_2", display_text: "Level 2" }
    ];

    const result = toCasesToAssignTable(casesToAssign, riskLevels, i18n);

    expect(result.data).toEqual(expected.data);
    expect(result.query).toEqual(expected.query);
    expect(result.columns.map(column => column.name)).toEqual(["", "level_1", "level_2", "none"]);
  });
});
