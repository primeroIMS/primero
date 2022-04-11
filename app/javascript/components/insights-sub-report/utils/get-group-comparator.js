import { MONTH, QUARTER, YEAR } from "../../insights/constants";

import quarterComparator from "./quarter-comparator";
import monthComparator from "./month-comparator";
import yearComparator from "./year-comparator";

export default groupedBy =>
  ({
    [QUARTER]: quarterComparator,
    [MONTH]: monthComparator,
    [YEAR]: yearComparator
  }[groupedBy]);
