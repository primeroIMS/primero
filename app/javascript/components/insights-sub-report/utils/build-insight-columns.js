import { YEAR } from "../../insights/constants";

import getGroupComparator from "./get-group-comparator";
import getDataGroups from "./get-data-groups";
import translateGroups from "./translate-groups";

const buildGroupedColumns = (value, groupedBy, localizeDate) => {
  const { years, groups } = getDataGroups(value, groupedBy);
  const groupComparator = getGroupComparator(groupedBy);
  const yearComparator = getGroupComparator(YEAR);

  if (groupedBy === YEAR) {
    return [{ items: years.sort(yearComparator), colspan: 1 }];
  }

  const translatedGroups = translateGroups(groups.sort(groupComparator), groupedBy, localizeDate);

  return [
    { items: years.sort(yearComparator), colspan: groups.length },
    { items: translatedGroups, addEmptyCell: false }
  ];
};

export default ({ value, isGrouped, groupedBy, localizeDate }) => {
  if (isGrouped && groupedBy) {
    return buildGroupedColumns(value, groupedBy, localizeDate);
  }

  return [];
};
