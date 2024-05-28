// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { WEEK, YEAR } from "../../insights/constants";

import getGroupComparator from "./get-group-comparator";
import getDataGroups from "./get-data-groups";
import translateGroupId from "./translate-group-id";
import getGroupTranslator from "./get-group-translator";

const buildGroupedColumns = (value, groupedBy, localizeDate, subColumnItems) => {
  const groups = getDataGroups(value, groupedBy);
  const groupComparator = getGroupComparator(groupedBy);
  const groupTranslator = getGroupTranslator(groupedBy);

  if ([WEEK, YEAR].includes(groupedBy)) {
    return groups.sort(groupComparator).map(week => ({
      label: translateGroupId(week, groupedBy, localizeDate),
      subItems: subColumnItems,
      colspan: subColumnItems?.length || 1
    }));
  }

  return Object.keys(groups).map(year => ({
    label: year,
    items: groups[year].sort(groupComparator).map(group => groupTranslator(group, localizeDate)),
    subItems: subColumnItems,
    colspan: groups[year].length * (subColumnItems?.length || 1)
  }));
};

export default {
  ghn_report: ({ value, getLookupValue, totalText }) => {
    const grouped = value.some(fs => fs.get("group_id"));

    if (grouped) {
      return value.map(val => ({ label: getLookupValue({}, val, "group_id") }));
    }

    return [{ label: totalText }];
  },
  default: ({ value, isGrouped, groupedBy, localizeDate, totalText, subColumnItems = [], hasTotalColumn }) => {
    if (isGrouped && groupedBy) {
      return buildGroupedColumns(value, groupedBy, localizeDate, subColumnItems);
    }

    const columns = subColumnItems.map(elem => ({ label: elem.display_text }));

    return hasTotalColumn ? columns : [...columns, { label: totalText }];
  }
};
