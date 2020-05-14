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
      })
    ];

    const expected = {
      columns: [
        { name: "case_worker", label: {} },
        { name: "followups", label: {} },
        { name: "case_plan", label: {} }
      ],
      data: [["primero", 0, 0]],
      query: [
        {
          case_worker: [],
          followups: ["record_state=true"],
          case_plan: ["record_state=true"]
        }
      ]
    };

    const converted = toTasksOverdueTable(data, i18nMock);

    expect(converted).to.deep.equal(expected);
  });
});
