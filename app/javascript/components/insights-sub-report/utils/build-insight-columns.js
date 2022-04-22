import { YEAR } from "../../insights/constants";

import getGroupComparator from "./get-group-comparator";
import getDataGroups from "./get-data-groups";
import translateGroups from "./translate-groups";

const buildGroupedColumns = (value, groupedBy, localizeDate) => {
  const groups = getDataGroups(value, groupedBy);
  const groupComparator = getGroupComparator(groupedBy);
  const yearComparator = getGroupComparator(YEAR);

  if (groupedBy === YEAR) {
    return [{ items: groups.sort(yearComparator), colspan: 1 }];
  }

  return Object.keys(groups).map(year => ({
    label: year,
    items: translateGroups(groups[year].sort(groupComparator), groupedBy, localizeDate),
    colspan: groups[year].length
  }));
};

export default ({ value, isGrouped, groupedBy, localizeDate }) => {
  if (isGrouped && groupedBy) {
    return buildGroupedColumns(value, groupedBy, localizeDate);
  }

  return [];
};
