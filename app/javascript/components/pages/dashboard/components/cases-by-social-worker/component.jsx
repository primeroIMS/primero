import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { fromJS } from "immutable";

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

  // const data = useSelector(state => getCasesBySocialWorker(state));
  const data = fromJS({
    indicators: {
      total: {
        primero: {
          count: 5,
          query: ["test=0", "user=primero"]
        },
        primero_cp: {
          count: 10,
          query: ["test=10", "user=primero_cp"]
        },
        primero_mgr_cp: {
          count: 4,
          query: ["test=4", "user=primero_cp"]
        }
      },
      new_and_updated: {
        primero: {
          count: 0,
          query: ["test=0", "user=primero"]
        },
        primero_cp: {
          count: 1,
          query: ["test=10", "user=primero_cp"]
        },
        primero_mgr_cp: {
          count: 16,
          query: ["test=16", "user=primero_cp"]
        }
      }
    }
  });

  const casesBySocialWorkerProps = {
    ...toCasesBySocialWorkerTable(data, i18n)
  };

  console.log("casesBySocialWorkerProps", casesBySocialWorkerProps);

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
