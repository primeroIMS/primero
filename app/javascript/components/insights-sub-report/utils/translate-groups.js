import { QUARTERS } from "../../../config/constants";

import translateQuarter from "./translate-quarter";
import translateMonth from "./translate-month";

export default (groups, localizeDate) =>
  groups.some(group => QUARTERS.includes(group))
    ? groups.map(group => translateQuarter(group, localizeDate))
    : groups.map(group => translateMonth(group, localizeDate));
