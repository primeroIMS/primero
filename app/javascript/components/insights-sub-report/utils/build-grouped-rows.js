import { fromJS } from "immutable";

import { WEEK, YEAR } from "../../insights/constants";

import getGroupComparator from "./get-group-comparator";
import yearComparator from "./year-comparator";
import getDataGroups from "./get-data-groups";
import weekComparator from "./week-comparator";
import buildRows from "./build-rows";
import getRowsWithValues from "./get-rows-with-values";

const groupByYearOrWeek = ({ key, subColumnItems, groupedBy, rowTitles, groups, getLookupValue, groupedData }) => {
  const columnsNumber = subColumnItems?.length ? subColumnItems.length * groups.length : groups.length;
  const sortedGroups = groupedBy === WEEK ? groups.sort(weekComparator) : groups;

  return sortedGroups
    .reduce((acc, year, index) => {
      const columnIndex = subColumnItems?.length ? index * subColumnItems?.length + 1 : index + 1;
      const data = groupedData.get(year, fromJS([]));
      const rowsWithValues = getRowsWithValues({ data, key, getLookupValue, subColumnItems, rowTitles });

      return buildRows({ rowsWithValues, currentRows: acc, columnsNumber, columnIndex });
    }, [])
    .map(value => ({ colspan: 0, row: value }));
};

const groupByMonthOrQuarter = ({ key, subColumnItems, groupedBy, rowTitles, groups, getLookupValue, groupedData }) => {
  const groupComparator = getGroupComparator(groupedBy);

  const columnsNumber = subColumnItems.length
    ? subColumnItems.length * Object.values(groups).flat().length
    : Object.values(groups).flat().length;

  const years = Object.keys(groups);
  let currentRows = [];

  years.sort(yearComparator).forEach((year, yearIndex) => {
    const previousYears = new Array(yearIndex).fill(0, 0, yearIndex);
    const columnsWritten = previousYears.reduce((acc, _value, index) => acc + groups[years[index]].length, 0);
    // index + 1 because the first value is the title of the row
    const columnInitialIndex = subColumnItems.length
      ? subColumnItems.length * (columnsWritten || 0) + 1
      : columnsWritten + 1;

    groups[year].sort(groupComparator).forEach((group, index) => {
      const data = groupedData.get(`${year}-${group}`, fromJS([]));
      const rowsWithValues = getRowsWithValues({ data, key, getLookupValue, subColumnItems, rowTitles });
      const columnsCurrentGroup = subColumnItems.length ? subColumnItems.length * index : index;
      const columnIndex = columnInitialIndex + columnsCurrentGroup;

      currentRows = buildRows({ rowsWithValues, currentRows, columnIndex, columnsNumber });
    });
  });

  return currentRows.map(value => ({ colspan: 0, row: value }));
};

export default ({ getLookupValue, data, key, groupedBy, subColumnItems, rowTitles }) => {
  const groups = getDataGroups(data, groupedBy);
  const groupedData = data.groupBy(value => value.get("group_id").toString());

  if ([YEAR, WEEK].includes(groupedBy)) {
    return groupByYearOrWeek({ getLookupValue, subColumnItems, rowTitles, groups, groupedData, key });
  }

  return groupByMonthOrQuarter({ getLookupValue, subColumnItems, rowTitles, groups, groupedData, key });
};
