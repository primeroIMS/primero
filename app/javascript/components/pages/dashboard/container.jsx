// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";

import { useI18n } from "../../i18n";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { getPermissions } from "../../user/selectors";
import { getLoading, getErrors } from "../../index-table";
import { OfflineAlert } from "../../disable-offline";
import { usePermissions, ACTIONS, RESOURCES, DASH_APPROVALS, getPermissionsByRecord } from "../../permissions";
import { RECORD_PATH } from "../../../config";
import { useMemoizedSelector } from "../../../libs";

import {
  ActionNeeded,
  Approvals,
  CasesBySocialWorker,
  CasesToAssign,
  Flags,
  OverdueTasks,
  Overview,
  PerpetratorArmedForceGroupPartyNames,
  ProtectionConcern,
  ReportingLocation,
  SharedFromMyTeam,
  SharedWithMyTeam,
  ReferralsAndTransfers,
  ViolationsCategoryRegion,
  ViolationsCategoryVerificationStatus,
  WorkflowIndividualCases,
  WorkflowTeamCases
} from "./components";
import NAMESPACE from "./namespace";
import { NAME } from "./constants";
import { fetchDashboards, fetchFlags } from "./action-creators";
import css from "./styles.css";
import permittedDashboards from "./utils/permitted-dashboards";

const tableDashboards = [
  { component: SharedFromMyTeam, actions: [ACTIONS.DASH_SHARED_FROM_MY_TEAM] },
  { component: SharedWithMyTeam, actions: [ACTIONS.DASH_SHARED_WITH_MY_TEAM] },
  {
    component: OverdueTasks,
    actions: [
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES,
      ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS
    ]
  },
  { component: CasesBySocialWorker, actions: [ACTIONS.DASH_CASES_BY_SOCIAL_WORKER] },
  { component: WorkflowTeamCases, actions: [ACTIONS.DASH_WORKFLOW_TEAM] },
  { component: ReportingLocation, actions: [ACTIONS.DASH_REPORTING_LOCATION] },
  { component: ProtectionConcern, actions: [ACTIONS.DASH_PROTECTION_CONCERNS] },
  {
    component: ViolationsCategoryVerificationStatus,
    actions: [ACTIONS.DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS]
  },
  { component: ViolationsCategoryRegion, actions: [ACTIONS.DASH_VIOLATIONS_CATEGORY_REGION] },
  {
    component: PerpetratorArmedForceGroupPartyNames,
    actions: [ACTIONS.DASH_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES]
  }
];

function Dashboard() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const permittedAbilities = useMemoizedSelector(state => getPermissionsByRecord([state, RESOURCES.dashboards]));

  const canFetchFlags = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_FLAGS]);
  const canSeeReferrals = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]);
  const canSeeTransfers = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_TRANSFER, ACTIONS.MANAGE]);
  const canSeeSharedWithMe = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_SHARED_WITH_ME]);
  const canSeeSharedWithOthers = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_SHARED_WITH_OTHERS]);
  const canSeeSharedWithMyTeamOverview = usePermissions(RESOURCES.dashboards, [
    ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW
  ]);
  const canSeeActionNeededDashboards = usePermissions(RESOURCES.dashboards, [
    ACTIONS.DASH_ACTION_NEEDED_NEW_UPDATED,
    ACTIONS.DASH_ACTION_NEEDED_NEW_REFERRALS,
    ACTIONS.DASH_ACTION_NEEDED_TRANSFER_AWAITING_ACCEPTANCE
  ]);
  const canSeeOverviewDashboard = usePermissions(RESOURCES.dashboards, [
    ACTIONS.DASH_CASE_OVERVIEW,
    ACTIONS.DASH_CASE_RISK,
    ACTIONS.DASH_GROUP_OVERVIEW,
    ACTIONS.DASH_CASE_INCIDENT_OVERVIEW,
    ACTIONS.DASH_NATIONAL_ADMIN_SUMMARY
  ]);
  const canSeeWorkflowDashboard = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_WORKFLOW]);

  useEffect(() => {
    dispatch(fetchDashboards());

    if (canFetchFlags) {
      dispatch(fetchFlags(RECORD_PATH.cases, true));
    }
  }, []);

  const userPermissions = useMemoizedSelector(state => getPermissions(state));
  const loading = useMemoizedSelector(state => getLoading(state, NAMESPACE));
  const errors = useMemoizedSelector(state => getErrors(state, NAMESPACE));
  const loadingFlags = useMemoizedSelector(state => getLoading(state, [NAMESPACE, "flags"]));
  const flagsErrors = useMemoizedSelector(state => getErrors(state, [NAMESPACE, "flags"]));

  const showReferralsDashboard = (canSeeReferrals && canSeeSharedWithMe) || canSeeSharedWithOthers;
  const showTransferDashboard =
    canSeeSharedWithMyTeamOverview || canSeeSharedWithOthers || (canSeeSharedWithMe && canSeeTransfers);

  const indicatorProps = {
    overlay: true,
    type: NAMESPACE,
    loading,
    errors
  };

  const flagsIndicators = {
    overlay: true,
    type: NAMESPACE,
    loading: loadingFlags,
    errors: flagsErrors
  };

  const xlSize = canFetchFlags ? 9 : 12;
  const mdSize = canFetchFlags ? 8 : 12;

  const xlSizeOverview = canSeeActionNeededDashboards ? 4 : 12;
  const xlSizeActionNeeded = canSeeOverviewDashboard ? 8 : 12;

  const columnDashboards = [
    { component: Approvals, actions: DASH_APPROVALS },
    { component: ReferralsAndTransfers, actions: [], permitted: showReferralsDashboard || showTransferDashboard },
    { component: CasesToAssign, actions: [ACTIONS.DASH_CASES_TO_ASSIGN] }
  ];

  const [permittedColumnDashboards, permittedTableDashboards] = permittedDashboards({
    columnDashboards,
    permittedAbilities,
    tableDashboards
  });

  const xlSizeFlags = permittedColumnDashboards.length > 0 ? 3 : 12;
  const mdSizeFlags = permittedColumnDashboards.length > 0 ? 4 : 12;

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")} />
      <PageContent>
        <OfflineAlert text={i18n.t("messages.dashboard_offline")} />
        <Grid container spacing={3}>
          {canSeeOverviewDashboard && (
            <Grid item xl={xlSizeOverview} md={xlSizeOverview} xs={12} className={css.flex}>
              <Overview loadingIndicator={indicatorProps} userPermissions={userPermissions} />
            </Grid>
          )}
          {canSeeActionNeededDashboards && (
            <Grid item xl={xlSizeActionNeeded} md={xlSizeActionNeeded} xs={12} className={css.flex}>
              <ActionNeeded loadingIndicator={indicatorProps} userPermissions={userPermissions} />
            </Grid>
          )}
          {canSeeWorkflowDashboard && (
            <Grid item xl={12} md={12} xs={12}>
              <WorkflowIndividualCases loadingIndicator={indicatorProps} />
            </Grid>
          )}
          <Grid item xl={xlSize} md={mdSize} xs={12} className={css.flexFlow}>
            {permittedColumnDashboards.map(dashboard => (
              <dashboard.component loadingIndicator={indicatorProps} userPermissions={userPermissions} />
            ))}
          </Grid>
          {canFetchFlags && (
            <Grid item xl={xlSizeFlags} md={mdSizeFlags} xs={12} className={css.flex}>
              <Flags loadingIndicator={flagsIndicators} />
            </Grid>
          )}
          <Grid item xl={12} md={12} xs={12}>
            {permittedTableDashboards.map(dashboard => (
              <dashboard.component loadingIndicator={indicatorProps} userPermissions={userPermissions} />
            ))}
          </Grid>
        </Grid>
      </PageContent>
    </PageContainer>
  );
}

Dashboard.displayName = NAME;

export default Dashboard;
