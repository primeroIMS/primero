import { QUARTERS } from "../../../config/constants";

import quarterComparator from "./quarter-comparator";
import monthComparator from "./month-comparator";

export default groups => (groups.some(group => QUARTERS.includes(group)) ? quarterComparator : monthComparator);
