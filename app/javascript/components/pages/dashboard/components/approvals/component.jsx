// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Fragment } from "react";

import Permission, {
  usePermissions,
  RESOURCES,
  ACTIONS,
  DASH_APPROVALS,
  DASH_APPROVALS_PENDING
} from "../../../../permissions";
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
import { useMemoizedSelector } from "../../../../../libs";
import css from "../styles.css";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();

  const {
    dashApprovalPending,
    dashApprovalsAssessment,
    dashApprovalsCasePlan,
    dashApprovalsClosure,
    dashApprovalsActionPlan,
    dashApprovalsGbvClosure
  } = usePermissions(RESOURCES.dashboards, {
    dashApprovalPending: DASH_APPROVALS_PENDING,
    dashApprovalsAssessment: [ACTIONS.DASH_APPROVALS_ASSESSMENT],
    dashApprovalsCasePlan: [ACTIONS.DASH_APPROVALS_CASE_PLAN],
    dashApprovalsClosure: [ACTIONS.DASH_APPROVALS_CLOSURE],
    dashApprovalsActionPlan: [ACTIONS.DASH_APPROVALS_ACTION_PLAN],
    dashApprovalsGbvClosure: [ACTIONS.DASH_APPROVALS_GBV_CLOSURE]
  });

  const approvalsAssessmentPending = useMemoizedSelector(state => getApprovalsAssessmentPending(state));
  const approvalsCasePlanPending = useMemoizedSelector(state => getApprovalsClosurePending(state));
  const approvalsClosurePending = useMemoizedSelector(state => getApprovalsCasePlanPending(state));
  const approvalsActionPlanPending = useMemoizedSelector(state => getApprovalsActionPlanPending(state));
  const approvalsGbvClosurePending = useMemoizedSelector(state => getApprovalsGbvClosurePending(state));
  const approvalsAssessment = useMemoizedSelector(state => getApprovalsAssessment(state));
  const approvalsCasePlan = useMemoizedSelector(state => getApprovalsCasePlan(state));
  const approvalsClosure = useMemoizedSelector(state => getApprovalsClosure(state));
  const approvalsActionPlan = useMemoizedSelector(state => getApprovalsActionPlan(state));
  const approvalsGbvClosure = useMemoizedSelector(state => getApprovalsGbvClosure(state));

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
      key: "dashApprovalPending",
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: dashApprovalPending,
      options: {
        items: pendingApprovalsItems,
        sumTitle: i18n.t("dashboard.pending_approvals"),
        withTotal: false
      }
    },
    {
      key: "dashApprovalsAssessment",
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: dashApprovalsAssessment,
      options: {
        items: approvalsAssessment,
        sumTitle: approvalsLabels.get("assessment")
      }
    },
    {
      key: "dashApprovalsCasePlan",
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: dashApprovalsCasePlan,
      options: {
        items: approvalsCasePlan,
        sumTitle: approvalsLabels.get("case_plan")
      }
    },
    {
      key: "dashApprovalsClosure",
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: dashApprovalsClosure,
      options: {
        items: approvalsClosure,
        sumTitle: approvalsLabels.get("closure")
      }
    },
    {
      key: "dashApprovalsActionPlan",
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: dashApprovalsActionPlan,
      options: {
        items: approvalsActionPlan,
        sumTitle: approvalsLabels.get("action_plan")
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: dashApprovalsGbvClosure,
      options: {
        items: approvalsGbvClosure,
        sumTitle: approvalsLabels.get("gbv_closure")
      }
    }
  ].filter(dashboard => dashboard.actions);

  const renderDashboards = () => {
    return dashboards.map((dashboard, index) => {
      const { type, options, key } = dashboard;
      const Dashboard = dashboardType(type);

      return (
        <Fragment key={key}>
          <div className={css.optionsBox}>
            <OptionsBox flat>
              <Dashboard {...options} />
            </OptionsBox>
          </div>
          {index === dashboards.length - 1 || <div className={css.divider} />}
        </Fragment>
      );
    });
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={DASH_APPROVALS}>
      <OptionsBox title={i18n.t("dashboard.approvals")} hasData={approvalsDashHasData} {...loadingIndicator}>
        <div className={css.container}>{renderDashboards()}</div>
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
