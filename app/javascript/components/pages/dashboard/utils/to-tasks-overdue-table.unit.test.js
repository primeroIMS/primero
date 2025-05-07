// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import toTasksOverdueTable from "./to-tasks-overdue-table";

describe("toTasksOverdueTable - pages/dashboard/utils/", () => {
  it("should convert the data for DashboardTable", () => {
    const i18nMock = { t: () => ({}), locale: "en" };

    const data = [
      fromJS({
        name: "dashboard.cases_by_task_overdue_followups",
        type: "indicator",
        indicators: {
          tasks_overdue_followups: {
            primero: {
              count: 0,
              query: ["record_state=true"]
            },
            primero_mgr_cp: {
              count: 3,
              query: ["record_state=true"]
            }
          }
        }
      }),
      fromJS({
        name: "dashboard.cases_by_task_overdue_case_plan",
        type: "indicator",
        indicators: {
          tasks_overdue_case_plan: {
            primero: {
              count: 0,
              query: ["record_state=true"]
            }
          }
        }
      }),
      fromJS({
        name: "dashboard.cases_by_task_overdue_assessment",
        type: "indicator",
        indicators: {
          tasks_overdue_assessment: {
            primero: {
              count: 2,
              query: ["record_state=true"]
            },
            primero_cp: {
              count: 1,
              query: ["record_state=true"]
            }
          }
        }
      })
    ];

    const expected = {
      columns: [
        { name: "case_worker", label: {} },
        { name: "followups", label: {} },
        { name: "case_plan", label: {} },
        { name: "assessment", label: {} }
      ],
      data: [
        ["primero", 0, 0, 2],
        ["primero_mgr_cp", 3, 0, 0],
        ["primero_cp", 0, 0, 1]
      ],
      query: [
        {
          case_worker: [],
          case_plan: ["record_state=true"],
          followups: ["record_state=true"],
          assessment: ["record_state=true"]
        },
        {
          assessment: [],
          case_plan: [],
          case_worker: [],
          followups: ["record_state=true"]
        },
        {
          case_worker: [],
          case_plan: [],
          followups: [],
          assessment: ["record_state=true"]
        }
      ]
    };

    const converted = toTasksOverdueTable(data, i18nMock);

    expect(converted).toEqual(expected);
  });
});
