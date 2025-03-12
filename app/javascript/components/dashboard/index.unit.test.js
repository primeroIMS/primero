// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import * as index from "./index";

describe("<Dashboard /> - index", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
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
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
