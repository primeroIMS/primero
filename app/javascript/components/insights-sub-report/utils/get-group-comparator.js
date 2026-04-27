import { MONTH, QUARTER, WEEK, YEAR } from "../../insights/constants";

import quarterComparator from "./quarter-comparator";
import monthComparator from "./month-comparator";
import yearComparator from "./year-comparator";
import weekComparator from "./week-comparator";

export default groupedBy =>
  ({
    [QUARTER]: quarterComparator,
    [MONTH]: monthComparator,
    [YEAR]: yearComparator,
    [WEEK]: weekComparator
  }[groupedBy]);
