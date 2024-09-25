// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DASHBOARD_TYPES } from "../constants";
import { OverviewBox, BadgedIndicator, TotalBox } from "../../../dashboard";

export default type => {
  switch (type) {
    case DASHBOARD_TYPES.BADGED_INDICATOR:
      return BadgedIndicator;
    case DASHBOARD_TYPES.OVERVIEW_BOX:
      return OverviewBox;
    case DASHBOARD_TYPES.TOTAL_BOX:
      return TotalBox;
    default:
      return null;
  }
};
