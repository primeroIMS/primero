import { YEAR } from "../../insights/constants";

import getGroupComparator from "./get-group-comparator";
import getDataGroups from "./get-data-groups";
import translateGroups from "./translate-groups";

const buildGroupedColumns = (value, groupedBy, localizeDate, subColumnItems) => {
  const groups = getDataGroups(value, groupedBy);
  const groupComparator = getGroupComparator(groupedBy);
  const yearComparator = getGroupComparator(YEAR);

  if (groupedBy === YEAR) {
    return groups
      .sort(yearComparator)
      .map(year => ({ label: year, subItems: subColumnItems, colspan: subColumnItems?.length || 1 }));
  }

  return Object.keys(groups).map(year => ({
    label: year,
    items: translateGroups(groups[year].sort(groupComparator), groupedBy, localizeDate),
    subItems: subColumnItems,
    colspan: groups[year].length * (subColumnItems?.length || 1)
  }));
};

export default {
  ghn_report: ({ value, getLookupValue }) => {
    return value.map(val => ({ label: getLookupValue({}, val, "group_id") }));
  },
  default: ({ value, isGrouped, groupedBy, localizeDate, totalText, subColumnItems }) => {
    if (isGrouped && groupedBy) {
      return buildGroupedColumns(value, groupedBy, localizeDate, subColumnItems);
    }

    return [{ label: totalText }];
  }
};
