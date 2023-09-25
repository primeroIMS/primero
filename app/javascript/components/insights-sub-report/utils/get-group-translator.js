import { MONTH, QUARTER, WEEK, YEAR } from "../../insights/constants";

import translateMonth from "./translate-month";
import translateQuarter from "./translate-quarter";
import translateWeek from "./translate-week";

export default groupedBy =>
  ({
    [QUARTER]: translateQuarter,
    [MONTH]: translateMonth,
    [WEEK]: translateWeek,
    [YEAR]: value => value.toString()
  }[groupedBy]);
