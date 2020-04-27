import { dataToJS } from "../../../../libs";
import { INDICATOR_NAMES, PROTECTION_CONCERNS_ORDER_NAMES } from "../constants";

import { dashboardTableData } from "./to-reporting-location-table";

const byProtectionConcernsNames = (a, b) => {
  const indexa = PROTECTION_CONCERNS_ORDER_NAMES.indexOf(a?.name);
  const indexb = PROTECTION_CONCERNS_ORDER_NAMES.indexOf(b?.name);

  return indexa - indexb;
};

export default (data, i18n, lookups) => {
  const firstColumn = {
    name: "",
    label: i18n.t("dashboard.protection_concern")
  };
  const labels = {
    protection_concerns_all_cases: i18n.t("dashboard.all_cases"),
    protection_concerns_open_cases: i18n.t("dashboard.open_cases"),
    protection_concerns_new_this_week: i18n.t("dashboard.new_this_week"),
    protection_concerns_closed_this_week: i18n.t("dashboard.closed_this_week")
  };

  const indicators = [
    INDICATOR_NAMES.PROTECTION_CONCERNS_ALL_CASES,
    INDICATOR_NAMES.PROTECTION_CONCERNS_OPEN_CASES,
    INDICATOR_NAMES.PROTECTION_CONCERNS_NEW_THIS_WEEK,
    INDICATOR_NAMES.PROTECTION_CONCERNS_CLOSED_THIS_WEEK
  ];

  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const columns = Object.keys(result.indicators)
      .reduce(
        (acum, column) => {
          return [...acum, { name: column, label: labels[column] }];
        },
        [{ ...firstColumn }]
      )
      .sort(byProtectionConcernsNames);
    const lookupsByCode = lookups.reduce((acc, lookup) => {
      acc[lookup.id] = lookup.display_text[i18n.locale];

      return acc;
    }, {});

    const countValues = dashboardTableData(
      lookupsByCode,
      result.indicators,
      indicators,
      "count"
    );
    const queryValues = dashboardTableData(
      lookupsByCode,
      result.indicators,
      indicators,
      "query"
    );

    const aaa = {
      columns,
      data: countValues,
      query: queryValues
    };

    return aaa;
  }

  return result;
};
