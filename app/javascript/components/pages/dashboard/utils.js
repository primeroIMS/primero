import { OverviewBox, BadgedIndicator } from "../../dashboard";

import { DASHBOARD_TYPES } from "./constants";

const dashboardType = type => {
  switch (type) {
    case DASHBOARD_TYPES.BADGED_INDICATOR:
      return BadgedIndicator;
    case DASHBOARD_TYPES.OVERVIEW_BOX:
      return OverviewBox;
    default:
      return null;
  }
};

export default dashboardType;
