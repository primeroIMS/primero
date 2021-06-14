import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import formattedDate from "./formatted-date";
import getAllKeysObject from "./get-all-keys-object";
import sortByDate from "./sort-by-date";

export default (data, i18n) => {
  if (isEmpty(data.report_data)) {
    return [];
  }
  const rows = data.fields.filter(field => field.position.type === "horizontal");
  const accum = [];
  const rowEntries = sortByDate(Object.entries(data.report_data), true);

  rowEntries.forEach(entry => {
    const [key, value] = entry;
    const qtyOfParentKeys = rows.length;

    if (qtyOfParentKeys >= 2) {
      accum.push([key, true, value._total || value[i18n.t("report.total")]]);
      const result = sortByDate(Object.keys(value))
        .filter(val => !["_total", i18n.t("report.total")].includes(val))
        .map(rowDisplayName => {
          const childObject = getAllKeysObject(i18n, value[rowDisplayName]);

          const values = childObject.map(child => {
            return get(value[rowDisplayName], child);
          });

          return [rowDisplayName, false, ...values];
        });

      // Set rest of keys
      const innerRows = [...sortByDate(result, true)].map(innerRow => {
        const [enDate, ...enValues] = innerRow;
        const dateOrExistingKey = formattedDate(enDate, i18n);

        return [dateOrExistingKey, ...enValues];
      });

      accum.push(...innerRows);
    } else {
      const valuesAccesor = getAllKeysObject(i18n, value);
      const values = valuesAccesor
        .filter(val => !["_total", i18n.t("report.total")].includes(val))
        .map(val => get(value, val));
      const dateOrKey = formattedDate(key, i18n);

      accum.push([dateOrKey, false, ...values, value._total || value[i18n.t("report.total")]]);
    }
  });

  return accum;
};
