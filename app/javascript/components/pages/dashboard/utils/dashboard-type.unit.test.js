// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DASHBOARD_TYPES } from "../constants";
import { BadgedIndicator, OverviewBox } from "../../../dashboard";

import dashboardType from "./dashboard-type";

describe("dashboardType - pages/dashboard/utils/", () => {
  it("should return BadgedIndicator component if dashboard type is badged indicator", () => {
    expect(dashboardType(DASHBOARD_TYPES.BADGED_INDICATOR)).toBe(BadgedIndicator);
  });
  it("should return OverviewBox component if dashboard type is overview box", () => {
    expect(dashboardType(DASHBOARD_TYPES.OVERVIEW_BOX)).toBe(OverviewBox);
  });
  it("should return null component if dashboard type is not valid", () => {
    expect(dashboardType("wrong")).toBeNull();
  });
});
