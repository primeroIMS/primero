import first from "lodash/first";
import { fromJS } from "immutable";

import { dataToJS } from "../../../libs";

import { INDICATOR_NAMES, WORKFLOW_ORDER_NAMES } from "./constants";

const translateLabels = (keys, data) => {
  if (!data?.length) {
    return {};
  }

  return keys
    .map(k => data.filter(d => d.id === k))
    .flat()
    .map(sorted => sorted.display_text);
};

const translateSingleLabel = (key, data) => {
  if (key === "") return key;

  return data.filter(d => d.id === key)[0].display_text;
};

const byTeamCaseNames = (a, b) => {
  const indexa = WORKFLOW_ORDER_NAMES.indexOf(a?.name);
  const indexb = WORKFLOW_ORDER_NAMES.indexOf(b?.name);

  return indexa - indexb;
};

const getFormattedList = (values, listKey) => {
  return values.map(r => {
    return Object.entries(r).reduce((acc, obj) => {
      const [key, val] = obj;

      return { ...acc, [key]: typeof val === "object" ? val[listKey] : val };
    }, {});
  });
};

export const toData1D = (data, localeLabels) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const indicatorData = result.indicators[INDICATOR_NAMES.WORKFLOW];
    const values = Object.values(indicatorData);

    return {
      labels: translateLabels(Object.keys(indicatorData), localeLabels),
      data: values.map(v => v.count),
      query: values.map(v => v.query)
    };
  }

  return result;
};

export const toListTable = (data, localeLabels) => {
  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const indicatorData = result.indicators[INDICATOR_NAMES.WORKFLOW_TEAM];
    const columns = Object.keys(
      indicatorData[first(Object.keys(indicatorData))]
    )
      .reduce((acum, value) => {
        return [
          ...acum,
          { name: value, label: translateSingleLabel(value, localeLabels) }
        ];
      }, [])
      .sort(byTeamCaseNames);

    const { "": removed, ...rows } = indicatorData;

    const values = Object.entries(rows).reduce((acum, value) => {
      const [user, userValue] = value;
      const columnValues = columns.reduce((a, o) => {
        return {
          ...a,
          [o.name]: o.name === "" ? user : userValue[o.name]
        };
      }, []);

      return [...acum, columnValues];
    }, []);

    return {
      columns,
      data: getFormattedList(values, "count"),
      query: getFormattedList(values, "query")
    };
  }

  return result;
};

export const toReportingLocationTable = (data, fieldKey, i18n, locations) => {
  const columns = [
    i18n.t(`location.base_types.${fieldKey}`),
    i18n.t("dashboard.open_cases"),
    i18n.t("dashboard.new_last_week"),
    i18n.t("dashboard.new_this_week"),
    i18n.t("dashboard.closed_last_week"),
    i18n.t("dashboard.closed_this_week")
  ];

  const indicators = [
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN,
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN_LAST_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN_THIS_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_LAST_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_THIS_WEEK
  ];

  const indicatorsData = data.get("indicators") || fromJS([]);

  const locationsByCode = {};

  locations.forEach(location => {
    locationsByCode[location.get("code")] = location
      .get("name")
      .get(i18n.locale);
  });

  const rows = indicators.reduce((acc, indicator) => {
    const indicatorData = indicatorsData.get(indicator) || fromJS({});

    indicatorData.keySeq().forEach(key => {
      const count = indicatorData.get(key).get("count");
      const locationLabel = locationsByCode[key] ? locationsByCode[key] : key;

      if (key) {
        acc[key] = acc[key] ? [...acc[key], count] : [locationLabel, count];
      }
    });

    return acc;
  }, {});

  return {
    columns,
    data: Object.keys(rows).map(key => rows[key])
  };
};
