import { QUARTER, YEAR } from "../../insights/constants";

import translateMonth from "./translate-month";
import translateQuarter from "./translate-quarter";

export default (groupId, groupedBy, localizeDate) => {
  if (groupedBy === YEAR) {
    return groupId.toString();
  }

  const [groupKey, year] = `${groupId}`.split("-");

  const translatedGroup =
    groupedBy === QUARTER ? translateQuarter(groupKey, localizeDate) : translateMonth(groupKey, localizeDate);

  return `${translatedGroup}-${year}`;
};
