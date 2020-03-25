import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Permission from "../../../../application/permission";
import {
  RESOURCES,
  ACTIONS,
  DASH_APPROVALS,
  DASH_APPROVALS_PENDING
} from "../../../../../libs/permissions";
import { OptionsBox } from "../../../../dashboard";
import { DASHBOARD_TYPES } from "../../constants";
import { useI18n } from "../../../../i18n";
import { toApprovalsManager } from "../../helpers";
import dashboardType from "../../utils";
import {
  getApprovalsAssessmentPending,
  getApprovalsClosurePending,
  getApprovalsCasePlanPending,
  getApprovalsAssessment,
  getApprovalsCasePlan,
  getApprovalsClosure
} from "../../selectors";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const approvalsAssessmentPending = useSelector(state =>
    getApprovalsAssessmentPending(state)
  );
  const approvalsCasePlanPending = useSelector(state =>
    getApprovalsClosurePending(state)
  );
  const approvalsClosurePending = useSelector(state =>
    getApprovalsCasePlanPending(state)
  );
  const approvalsAssessment = useSelector(state =>
    getApprovalsAssessment(state)
  );
  const approvalsCasePlan = useSelector(state => getApprovalsCasePlan(state));
  const approvalsClosure = useSelector(state => getApprovalsClosure(state));

  const pendingApprovalsItems = toApprovalsManager([
    approvalsAssessmentPending,
    approvalsCasePlanPending,
    approvalsClosurePending
  ]);

  const approvalsDashHasData = Boolean(
    pendingApprovalsItems.get("indicators").size ||
      approvalsAssessment.size ||
      approvalsCasePlan.size ||
      approvalsClosure.size
  );

  const dashboards = [
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: DASH_APPROVALS_PENDING,
      options: {
        items: pendingApprovalsItems,
        sumTitle: i18n.t("dashboard.pending_approvals"),
        withTotal: false
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_APPROVALS_ASSESSMENT,
      options: {
        items: approvalsAssessment,
        sumTitle: i18n.t(approvalsAssessment.get("name"))
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_APPROVALS_CASE_PLAN,
      options: {
        items: approvalsCasePlan,
        sumTitle: i18n.t(approvalsCasePlan.get("name"))
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_APPROVALS_CLOSURE,
      options: {
        items: approvalsClosure,
        sumTitle: i18n.t(approvalsClosure.get("name"))
      }
    }
  ];

  const renderDashboards = () => {
    return dashboards.map(dashboard => {
      const { type, actions, options } = dashboard;
      const Dashboard = dashboardType(type);

      return (
        <Permission
          key={actions}
          resources={RESOURCES.dashboards}
          actions={actions}
        >
          <Grid item xs>
            <OptionsBox flat>
              <Dashboard {...options} />
            </OptionsBox>
          </Grid>
        </Permission>
      );
    });
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={DASH_APPROVALS}>
      <Grid item xl={9} md={8} xs={12}>
        <OptionsBox
          title={i18n.t("dashboard.approvals")}
          hasData={approvalsDashHasData}
          {...loadingIndicator}
        >
          <Grid item md={12}>
            <Grid container>{renderDashboards()}</Grid>
          </Grid>
        </OptionsBox>
      </Grid>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object,
  userPermissions: PropTypes.object
};

export default Component;
