import { dataToJS } from "../../../../libs";
import { INDICATOR_NAMES } from "../constants";

export const dashboardTableData = (
  optionsByIndex,
  data,
  indicators,
  listKey
) => {
  const rows = indicators.reduce((acc, indicator) => {
    const indicatorData = data[indicator];

    Object.keys(indicatorData).forEach(key => {
      const optionLabel = optionsByIndex[key] ? optionsByIndex[key] : key;

      if (key) {
        const listKeyValue = { [indicator]: indicatorData[key][listKey] };
        const optionLabelValue = { "": optionLabel };

        acc[key] = acc[key]
          ? { ...acc[key], ...listKeyValue }
          : { ...optionLabelValue, ...listKeyValue };
      }
    });

    return acc;
  }, {});

  return Object.keys(rows).map(key => rows[key]);
};

export default (data, fieldKey, i18n, locations) => {
  const columns = [
    { name: "", label: i18n.t(`location.base_types.${fieldKey}`) },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_OPEN,
      label: i18n.t("dashboard.open_cases")
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_OPEN_LAST_WEEK,
      label: i18n.t("dashboard.new_last_week")
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_OPEN_THIS_WEEK,
      label: i18n.t("dashboard.new_this_week")
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_LAST_WEEK,
      label: i18n.t("dashboard.closed_last_week")
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_THIS_WEEK,
      label: i18n.t("dashboard.closed_this_week")
    }
  ];

  const indicators = [
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN,
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN_LAST_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN_THIS_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_LAST_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_THIS_WEEK
  ];

  const locationsByCode = {};

  locations.forEach(location => {
    locationsByCode[location.get("code")] = location
      .get("name")
      .get(i18n.locale);
  });

  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const countValues = dashboardTableData(
      locationsByCode,
      result.indicators,
      indicators,
      "count"
    );

    const queryValues = dashboardTableData(
      locationsByCode,
      result.indicators,
      indicators,
      "query"
    );

    return {
      columns,
      data: countValues,
      query: queryValues
    };
  }

  return {
    columns,
    data: [],
    query: []
  };
};
