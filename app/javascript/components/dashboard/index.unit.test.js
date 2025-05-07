// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import * as index from "./index";

describe("<Dashboard /> - index", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
    [
      "ActionMenu",
      "BadgedIndicator",
      "DashboardChip",
      "DashboardTable",
      "DoughnutChart",
      "FlagBox",
      "LineChart",
      "OptionsBox",
      "OverviewBox",
      "PieChart",
      "TotalBox"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });

    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
