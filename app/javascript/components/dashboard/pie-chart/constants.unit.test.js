// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as pieChartConstants from "./constants";

describe("<PieChart /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...pieChartConstants };

    ["NAME", "COLORS"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
