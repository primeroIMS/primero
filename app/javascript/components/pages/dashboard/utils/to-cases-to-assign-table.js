import { fromJS } from "immutable";

export default (casesToAssign, riskLevels, i18n) => {
  const allLevels = riskLevels.concat({ id: "none", display_text: i18n.t("dashboard.none_risk") });
  const indicators = casesToAssign.get("indicators", fromJS({}));

  const columns = allLevels.reduce(
    (acc, elem) => {
      return [...acc, { name: elem.id, label: elem.display_text }];
    },
    [{ label: "", name: "" }]
  );

  const data = allLevels.reduce(
    (acc, elem) => {
      ["cases", "overdue_cases"].forEach(key => {
        acc[key] = { ...acc[key], [elem.id]: indicators.getIn([`${key}_${elem.id}`, "count"], 0) };
        acc[`${key}_queries`] = {
          ...acc[`${key}_queries`],
          [elem.id]: indicators
            .getIn([`${key}_${elem.id}`, "query"], [])
            .reduce((queryAcc, query) => [...queryAcc, query], [])
        };
      });

      return acc;
    },
    { cases: {}, overdue_cases: {}, cases_queries: {}, overdue_cases_queries: {} }
  );

  return {
    columns,
    data: [
      { "": i18n.t("dashboard.cases_to_assign"), ...data.cases },
      { "": i18n.t("dashboard.overdue_cases_to_assign"), ...data.overdue_cases }
    ],
    query: [data.cases_queries, data.overdue_cases_queries]
  };
};
