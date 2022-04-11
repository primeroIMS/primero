import { QUARTER } from "../../insights/constants";

import translateQuarter from "./translate-quarter";
import translateMonth from "./translate-month";

export default (groups, groupedBy, localizeDate) =>
  groupedBy === QUARTER
    ? groups.map(group => translateQuarter(group, localizeDate))
    : groups.map(group => translateMonth(group, localizeDate));
