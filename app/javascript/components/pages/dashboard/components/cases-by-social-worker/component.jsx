import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getCasesBySocialWorker } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toCasesBySocialWorkerTable } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { ROUTES } from "../../../../../config";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const data = useSelector(state => getCasesBySocialWorker(state));

  const casesBySocialWorkerProps = {
    // ...toCasesBySocialWorkerTable(data, i18n)
    columns: [
      {
        name: "case_worker",
        label: "Case Worker"
      },
      {
        name: "total",
        label: "Total"
      },
      {
        name: "new_updated",
        label: "New & Updated"
      }
    ],
    data: [
      ["primero", 0, 10],
      ["primero_cp", 10, 0]
    ],
    query: [
      {
        case_worker: [],
        total: ["total=true", "owned_by=primero"],
        new_updated: ["new_updated=true", "owned_by=primero"]
      },
      {
        case_worker: [],
        total: ["total=true", "owned_by=primero_cp"],
        new_updated: ["new_updated=true", "owned_by=primero_cp"]
      }
    ]
  };

  // const actions = ACTIONS.DASH_CASES_BY_SOCIAL_WORKER;
  const actions = [
    ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
    ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
    ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES,
    ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS
  ];

  return (
    <Permission resources={RESOURCES.dashboards} actions={actions}>
      <OptionsBox title={i18n.t("dashboard.cases_by_social_worker")} hasData={Boolean(data.size)} {...loadingIndicator}>
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.cases_by_social_worker")}
          {...casesBySocialWorkerProps}
        />
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
