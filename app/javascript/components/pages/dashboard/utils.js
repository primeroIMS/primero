import first from "lodash/first";
import uniq from "lodash/uniq";
import { fromJS } from "immutable";

import { dataToJS } from "../../../libs";
import { ACTIONS, RESOURCES } from "../../../libs/permissions";
import { OverviewBox, BadgedIndicator } from "../../dashboard";

import {
  DASHBOARD_NAMES,
  DASHBOARD_TYPES,
  INDICATOR_NAMES,
  PROTECTION_CONCERNS_ORDER_NAMES
} from "./constants";

const translateLabels = (keys, data) => {
  if (!data?.length) {
    return {};
  }

  return (
    keys
      .map(k => data.filter(d => d.id === k))
      .flat()
      // eslint-disable-next-line camelcase
      .map(sorted => sorted?.display_text)
  );
};

const translateSingleLabel = (key, data) => {
  if (key === "") return key;

  // eslint-disable-next-line camelcase
  return data?.filter(d => d.id === key)[0]?.display_text;
};

const byProtectionConcernsNames = (a, b) => {
  const indexa = PROTECTION_CONCERNS_ORDER_NAMES.indexOf(a?.name);
  const indexb = PROTECTION_CONCERNS_ORDER_NAMES.indexOf(b?.name);

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

const dashboardTableData = (optionsByIndex, data, indicators, listKey) => {
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

const userHasPermission = (userPermissions, resource, action) =>
  userPermissions
    .get(resource, fromJS([]))
    .filter(resourceAction => action.includes(resourceAction))
    .isEmpty() === false;

const isPermittedIndicator = (userPermissions, indicatorName) => {
  const indicators = {
    shared_with_me_total_referrals: [
      RESOURCES.cases,
      [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]
    ],
    shared_with_me_new_referrals: [
      RESOURCES.cases,
      [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]
    ],
    shared_with_me_transfers_awaiting_acceptance: [
      RESOURCES.cases,
      [ACTIONS.RECEIVE_TRANSFER, ACTIONS.MANAGE]
    ]
  };

  const [resource, action] = indicators[indicatorName];

  if (resource && action) {
    return userHasPermission(userPermissions, resource, action);
  }

  return false;
};

export const dashboardType = type => {
  switch (type) {
    case DASHBOARD_TYPES.BADGED_INDICATOR:
      return BadgedIndicator;
    case DASHBOARD_TYPES.OVERVIEW_BOX:
      return OverviewBox;
    default:
      return null;
  }
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
      .filter(column => typeof column.label !== "undefined")
      .sort((a, b) => {
        const workflowOrder = localeLabels?.map(localeLabel => localeLabel.id);
        const indexa = workflowOrder.indexOf(a?.name);
        const indexb = workflowOrder.indexOf(b?.name);

        return indexa - indexb;
      });

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

export const toApprovalsManager = data => {
  const resultData = data.reduce(
    (acc, curr) => {
      const indicatorData = curr.get("indicators") || fromJS({});
      const key = indicatorData.keySeq().first();

      if (key) {
        acc.indicators[key] = curr.getIn(["indicators", key]);
      }

      return { ...acc };
    },
    { indicators: {} }
  );

  return fromJS(resultData);
};

export const toProtectionConcernTable = (data, i18n, lookups) => {
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

export const toTasksOverdueTable = (overdueTasksDashboards, i18n) => {
  const indicatorsResults = overdueTasksDashboards
    .filter(dashboard => dashboard.size)
    .map(dashboard => dashboard.get("indicators").valueSeq().first());

  const hashedData = indicatorsResults.reduce(
    (acc, indicatorResult) => {
      indicatorResult.forEach((value, key) => {
        if (acc.values[key]) {
          acc.values[key].push(value.get("count"));
        } else {
          acc.values[key] = [key, value.get("count")];
        }

        if (acc.queries[key]) {
          acc.queries[key].push(value.get("query").toJS());
        } else {
          acc.queries[key] = [[], value.get("query").toJS()];
        }
      });

      return acc;
    },
    { values: {}, queries: {} }
  );

  const dashboardColumns = {
    [DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_ASSESSMENT]: {
      name: "assessment",
      label: i18n.t("dashboard.assessment")
    },
    [DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_CASE_PLAN]: {
      name: "case_plan",
      label: i18n.t("dashboard.case_plan")
    },
    [DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_SERVICES]: {
      name: "services",
      label: i18n.t("dashboard.services")
    },
    [DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_FOLLOWUPS]: {
      name: "followups",
      label: i18n.t("dashboard.follow_up")
    }
  };

  const columns = [
    { name: "case_worker", label: i18n.t("dashboard.case_worker") }
  ].concat(
    overdueTasksDashboards
      .filter(dashboard => dashboard.size)
      .map(dashboard => dashboardColumns[dashboard.get("name")])
  );

  return {
    columns,
    data: Object.values(hashedData.values),
    query: Object.values(hashedData.queries).map(queries =>
      queries.reduce((acc, value, index) => {
        acc[columns[index].name] = value;

        return acc;
      }, {})
    )
  };
};

export const permittedSharedWithMe = (
  sharedWithMeDashboard,
  userPermissions
) => {
  const permittedIndicators = sharedWithMeDashboard
    .get("indicators", fromJS({}))
    .filter((v, k) => isPermittedIndicator(userPermissions, k));

  return fromJS({
    indicators: permittedIndicators
  });
};

export const taskOverdueHasData = (
  casesByTaskOverdueAssessment,
  casesByTaskOverdueCasePlan,
  casesByTaskOverdueServices,
  casesByTaskOverdueFollowups
) => {
  return (
    !!casesByTaskOverdueAssessment.size ||
    !!casesByTaskOverdueCasePlan.size ||
    !!casesByTaskOverdueServices.size ||
    !!casesByTaskOverdueFollowups.size
  );
};

export const teamSharingTable = (dashboard, i18n) => {
  const data = dataToJS(dashboard);

  if (!Object.keys(data).length) {
    return {};
  }
  const { indicators } = data;
  const columns = Object.keys(indicators).reduce((acc, curr) => {
    return [...acc, { name: curr, label: i18n.t(`dashboard.${curr}`) }];
  }, []);

  columns.unshift({
    name: "caseWorker",
    label: i18n.t("dashboard.case_worker")
  });

  const caseWorkers = uniq(
    Object.values(indicators).reduce((acc, curr) => {
      return [...acc, ...Object.keys(curr)];
    }, [])
  );
  const rowsWithValues = key => {
    return caseWorkers.map(caseWorker => {
      const caseWorkerWithValues = columns
        .map(column => {
          if (column.name !== "caseWorker") {
            return {
              [column.name]:
                typeof indicators[column.name] !== "undefined" &&
                indicators[column.name].hasOwnProperty(caseWorker)
                  ? indicators[column.name][caseWorker][key]
                  : 0
            };
          }

          return "";
        })
        .reduce((acc, obj) => ({ ...acc, ...obj }));

      return {
        caseWorker,
        ...caseWorkerWithValues
      };
    });
  };

  return {
    columns,
    data: rowsWithValues("count"),
    query: rowsWithValues("query")
  };
};
