import { DASHBOARD_NAMES } from "../constants";

export default (overdueTasksDashboards, i18n) => {
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
