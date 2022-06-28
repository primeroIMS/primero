import { fromJS } from "immutable";
import first from "lodash/first";
import sortBy from "lodash/sortBy";

import { YEAR } from "../../insights/constants";

import getGroupComparator from "./get-group-comparator";
import yearComparator from "./year-comparator";
import getDataGroups from "./get-data-groups";
import sortWithSortedArray from "./sort-with-sorted-array";

const buildRows = ({ tuples, rows, columnIndex, columnsNumber }) => {
  tuples.forEach(tuple => {
    const [lookupValue, value] = tuple;

    const existing = rows.find(elem => first(elem) === lookupValue);

    if (existing) {
      existing[columnIndex] = value;
    } else {
      rows.push(
        [lookupValue]
          .concat(new Array(columnsNumber).fill(0, 0, columnsNumber))
          .fill(value, columnIndex, columnIndex + 1)
      );
    }
  });
};

const buildGroupedRows = ({ getLookupValue, data, key, groupedBy }) => {
  const groups = getDataGroups(data, groupedBy);

  const groupedData = data.groupBy(value => value.get("group_id").toString());

  if (groupedBy === YEAR) {
    return (
      groups
        // .sort(yearComparator)
        .reduce((acc, year, index) => {
          const tuples = groupedData
            .get(year, fromJS([]))
            .flatMap(value => value.get("data").map(dataElem => [getLookupValue(key, dataElem), dataElem.get("total")]))
            .toArray();

          buildRows({ tuples, rows: acc, columnsNumber: groups.length, columnIndex: index + 1 });

          return acc;
        }, [])
        .map(value => ({ colspan: 0, row: value }))
    );
  }

  const groupComparator = getGroupComparator(groupedBy);

  const columnsNumber = Object.values(groups).flat().length;

  const years = Object.keys(groups);

  return years
    .sort(yearComparator)
    .reduce((acc1, year, yearIndex) => {
      const previousYears = new Array(yearIndex).fill(0, 0, yearIndex);
      const columnsWritten = previousYears.reduce((acc, _value, index) => acc + groups[years[index]].length, 0);
      // index + 1 because the first value is the title of the row
      const columnInitialIndex = columnsWritten + 1;

      groups[year].sort(groupComparator).forEach((group, index) => {
        const tuples = groupedData
          .get(`${year}-${group}`, fromJS([]))
          .flatMap(value => value.get("data").map(dataElem => [getLookupValue(key, dataElem), dataElem.get("total")]))
          .toArray();

        buildRows({ tuples, rows: acc1, columnIndex: columnInitialIndex + index, columnsNumber });
      });

      return acc1;
    }, [])
    .map(value => ({ colspan: 0, row: value }));
};

const buildSingleRows = ({ getLookupValue, data, key }) =>
  data
    .map(value => {
      const lookupValue = getLookupValue(key, value);

      return { colspan: 0, row: [lookupValue, value.get("total")] };
    })
    .toArray();

export default {
  ghn_report: ({ data, getLookupValue, key }) => {
    const grouped = data.some(fs => fs.get("group_id"));

    if (data === 0) return [];

    if (grouped) {
      return buildGroupedRows({ data, key, getLookupValue, groupedBy: "year" });
    }

    return buildSingleRows({ data, getLookupValue, key });
  },
  default: ({ getLookupValue, data, key, isGrouped, groupedBy, ageRanges, lookupValues, incompleteDataLabel }) => {
    if (data === 0) return [];

    const lookupDisplayTexts = [
      ...(lookupValues?.map(lookupValue => lookupValue.display_text) || []),
      incompleteDataLabel
    ];

    const sortByFn = elem => first(elem.row);

    const rows =
      isGrouped && groupedBy
        ? buildGroupedRows({ data, key, getLookupValue, groupedBy })
        : buildSingleRows({ data, getLookupValue, key });

    if (key === "age") {
      return sortWithSortedArray(rows, ageRanges, sortByFn);
    }

    if (lookupDisplayTexts.length > 1) {
      return sortWithSortedArray(rows, lookupDisplayTexts, sortByFn);
    }

    return sortBy(rows, row => first(row.row));
  }
};
