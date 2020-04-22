import { DASHBOARD_TYPES } from "../constants";
import { OverviewBox, BadgedIndicator } from "../../../dashboard";

export default type => {
  switch (type) {
    case DASHBOARD_TYPES.BADGED_INDICATOR:
      return BadgedIndicator;
    case DASHBOARD_TYPES.OVERVIEW_BOX:
      return OverviewBox;
    default:
      return null;
  }
};
