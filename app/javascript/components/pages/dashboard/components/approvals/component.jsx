import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";

import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS, DASH_APPROVALS, DASH_APPROVALS_PENDING } from "../../../../../libs/permissions";
import { OptionsBox } from "../../../../dashboard";
import { DASHBOARD_TYPES } from "../../constants";
import { useI18n } from "../../../../i18n";
import { dashboardType, toApprovalsManager } from "../../utils";
import {
  getApprovalsAssessmentPending,
  getApprovalsClosurePending,
  getApprovalsCasePlanPending,
  getApprovalsActionPlanPending,
  getApprovalsGbvClosurePending,
  getApprovalsAssessment,
  getApprovalsCasePlan,
  getApprovalsClosure,
  getApprovalsActionPlan,
  getApprovalsGbvClosure
} from "../../selectors";
import { useApp } from "../../../../application";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();

  const approvalsAssessmentPending = useSelector(state => getApprovalsAssessmentPending(state));
  const approvalsCasePlanPending = useSelector(state => getApprovalsClosurePending(state));
  const approvalsClosurePending = useSelector(state => getApprovalsCasePlanPending(state));
  const approvalsActionPlanPending = useSelector(state => getApprovalsActionPlanPending(state));
  const approvalsGbvClosurePending = useSelector(state => getApprovalsGbvClosurePending(state));
  const approvalsAssessment = useSelector(state => getApprovalsAssessment(state));
  const approvalsCasePlan = useSelector(state => getApprovalsCasePlan(state));
  const approvalsClosure = useSelector(state => getApprovalsClosure(state));
  const approvalsActionPlan = useSelector(state => getApprovalsActionPlan(state));
  const approvalsGbvClosure = useSelector(state => getApprovalsGbvClosure(state));

  const pendingApprovalsItems = toApprovalsManager([
    approvalsAssessmentPending,
    approvalsCasePlanPending,
    approvalsClosurePending,
    approvalsActionPlanPending,
    approvalsGbvClosurePending
  ]);

  const approvalsDashHasData = Boolean(
    pendingApprovalsItems.get("indicators").size ||
      approvalsAssessment.size ||
      approvalsCasePlan.size ||
      approvalsClosure.size ||
      approvalsActionPlan.size ||
      approvalsGbvClosure.size
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
        sumTitle: approvalsLabels.assessment
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_APPROVALS_CASE_PLAN,
      options: {
        items: approvalsCasePlan,
        sumTitle: approvalsLabels.case_plan
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_APPROVALS_CLOSURE,
      options: {
        items: approvalsClosure,
        sumTitle: approvalsLabels.closure
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_APPROVALS_ACTION_PLAN,
      options: {
        items: approvalsActionPlan,
        sumTitle: approvalsLabels.action_plan
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_APPROVALS_GBV_CLOSURE,
      options: {
        items: approvalsGbvClosure,
        sumTitle: approvalsLabels.gbv_closure
      }
    }
  ];

  const renderDashboards = () => {
    return dashboards.map(dashboard => {
      const { type, actions, options } = dashboard;
      const Dashboard = dashboardType(type);

      return (
        <Permission key={actions} resources={RESOURCES.dashboards} actions={actions}>
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
      <OptionsBox title={i18n.t("dashboard.approvals")} hasData={approvalsDashHasData} {...loadingIndicator}>
        <Grid item md={12}>
          <Grid container>{renderDashboards()}</Grid>
        </Grid>
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object,
  userPermissions: PropTypes.object
};

export default Component;
