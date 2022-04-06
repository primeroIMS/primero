import { fromJS } from "immutable";
import first from "lodash/first";
import last from "lodash/last";
import isNil from "lodash/isNil";

import getGroupComparator from "./get-group-comparator";
import yearComparator from "./year-comparator";
import getDataGroups from "./get-data-groups";

export default (getLookupValue, data, key) => {
  if (data === 0) return [];

  if (data.some(elem => elem.get("group_id"))) {
    const { years, groups } = getDataGroups(data);

    const grouped = data.groupBy(value => value.get("group_id"));

    const columnsNumber = groups.length * years.length;

    const groupComparator = getGroupComparator(groups);

    const dataRows = years.sort(yearComparator).reduce((acc1, group1, groupIndex) => {
      // index + 1 because the first value is the title of the row
      const columnInitialIndex = groupIndex * groups.length + 1;

      groups.sort(groupComparator).forEach((group2, index) => {
        const rows = grouped
          .get(`${group2}-${group1}`, fromJS([]))
          .flatMap(value => value.get("data").map(dataElem => [getLookupValue(key, dataElem), dataElem.get("total")]))
          .toArray();
        const columnIndex = columnInitialIndex + index;

        rows.forEach(row => {
          const lookupValue = first(row);
          const value = last(row);
          const existing = acc1.find(elem => first(elem) === lookupValue);

          if (existing) {
            if (!isNil(existing[columnIndex])) {
              existing[columnIndex] = value;
            } else {
              // eslint-disable-next-line no-plusplus
              for (let i = columnIndex; i < columnsNumber; i++) {
                if (i === columnIndex) {
                  existing.push(value);
                } else if (isNil(existing[i])) {
                  existing.push(0);
                }
              }
            }
          } else {
            const pushedRow = [lookupValue];

            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < columnsNumber; i++) {
              // i + 1 because the first value is the title of the row
              if (i + 1 === columnIndex) {
                pushedRow.push(value);
              } else {
                pushedRow.push(0);
              }
            }
            acc1.push(pushedRow);
          }
        });
      });

      return acc1;
    }, []);

    return dataRows.map(value => ({ colspan: 0, row: value }));
  }

  return data
    .map(value => {
      const lookupValue = getLookupValue(key, value);

      return { colspan: 0, row: [lookupValue, value.get("total")] };
    })
    .toArray();
};
