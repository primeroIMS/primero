// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import taskOverdueHasData from "./tasks-overdue-has-data";

describe("taskOverdueHasData - pages/dashboard/utils/", () => {
  it("should respond false when taskOverdue has not data", () => {
    const result = taskOverdueHasData(fromJS({}), fromJS({}), fromJS({}), fromJS({}));

    expect(result).toBe(false);
  });

  it("should respond true when at least one taskOverdue has data", () => {
    const result = taskOverdueHasData(
      fromJS({
        name: "dashboard.cases_by_task_overdue_assessment",
        type: "indicator"
      }),
      fromJS({}),
      fromJS({}),
      fromJS({})
    );

    expect(result).toBe(true);
  });
});
