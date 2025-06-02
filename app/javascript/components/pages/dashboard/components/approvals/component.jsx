// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";

import Permission, {
  usePermissions,
  RESOURCES,
  ACTIONS,
  DASH_APPROVALS,
  DASH_APPROVALS_PENDING
} from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { DASHBOARD_GROUP, DASHBOARD_TYPES } from "../../constants";
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
  getApprovalsGbvClosure,
  getIsDashboardGroupLoading,
  getDashboardGroupHasData
} from "../../selectors";
import { selectUserModules, useApp } from "../../../../application";
import { useMemoizedSelector } from "../../../../../libs";
import css from "../styles.css";

import { NAME } from "./constants";

function Component() {
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

  const userModules = useMemoizedSelector(state => selectUserModules(state));
  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.approvals));
  const hasData = useMemoizedSelector(state => getDashboardGroupHasData(state, DASHBOARD_GROUP.approvals));
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

  const renderDashboards = primeroModule => {
    const moduleID = primeroModule.unique_id;

    const pendingApprovalsItems = toApprovalsManager([
      approvalsAssessmentPending[moduleID],
      approvalsCasePlanPending[moduleID],
      approvalsClosurePending[moduleID],
      approvalsActionPlanPending[moduleID],
      approvalsGbvClosurePending[moduleID]
    ]);

    function getLabel(key) {
      return approvalsLabels.getIn([moduleID, key], approvalsLabels.getIn(["default", key]));
    }

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
          items: approvalsAssessment[moduleID],
          titleKey: "assessment"
        }
      },
      {
        key: "dashApprovalsCasePlan",
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: dashApprovalsCasePlan,
        options: {
          items: approvalsCasePlan[moduleID],
          titleKey: "case_plan"
        }
      },
      {
        key: "dashApprovalsClosure",
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: dashApprovalsClosure,
        options: {
          items: approvalsClosure[moduleID],
          titleKey: "closure"
        }
      },
      {
        key: "dashApprovalsActionPlan",
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: dashApprovalsActionPlan,
        options: {
          items: approvalsActionPlan[moduleID],
          titleKey: "action_plan"
        }
      },
      {
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: dashApprovalsGbvClosure,
        options: {
          items: approvalsGbvClosure[moduleID],
          titleKey: "gbv_closure"
        }
      }
    ].filter(dashboard => dashboard.actions);

    return dashboards.map(dashboard => {
      const { type, options, key } = dashboard;
      const { items, sumTitle, titleKey } = options;
      const Dashboard = dashboardType(type);
      const label = sumTitle || getLabel(titleKey);
      const title = userModules.size === 1 ? label : `${label} - ${primeroModule.name}`;

      return (
        <Fragment key={key}>
          <div className={css.optionsBox}>
            <OptionsBox flat>
              <Dashboard items={items} sumTitle={title} titleHasModule />
            </OptionsBox>
          </div>
        </Fragment>
      );
    });
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={DASH_APPROVALS}>
      <OptionsBox title={i18n.t("dashboard.approvals")} hasData={hasData && !loading} loading={loading}>
        <div className={css.content}>{userModules.map(userModule => renderDashboards(userModule))}</div>
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
