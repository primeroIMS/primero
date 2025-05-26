// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";

import { useI18n } from "../../i18n";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { getCurrentUserModules, getPermissions } from "../../user/selectors";
import { OfflineAlert } from "../../disable-offline";
import { usePermissions, ACTIONS, RESOURCES, DASH_APPROVALS } from "../../permissions";
import { RECORD_PATH } from "../../../config";
import { useMemoizedSelector } from "../../../libs";
import { ACTION_NEEDED_DASHBOARD, OVERDUE_TASKS_DASHBOARD, OVERVIEW_DASHBOARD } from "../../permissions/constants";

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
import { DASHBOARD_GROUP, NAME } from "./constants";
import { fetchDashboardApprovals, fetchDashboards, fetchFlags } from "./action-creators";
import css from "./styles.css";
import permittedDashboards from "./utils/permitted-dashboards";

const tableDashboards = [
  { component: SharedFromMyTeam, actions: [ACTIONS.DASH_SHARED_FROM_MY_TEAM] },
  { component: SharedWithMyTeam, actions: [ACTIONS.DASH_SHARED_WITH_MY_TEAM] },
  { component: OverdueTasks, actions: OVERDUE_TASKS_DASHBOARD },
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
  const {
    canFetchFlags,
    canSeeSharedWithMe,
    canSeeSharedWithOthers,
    canSeeSharedWithMyTeamOverview,
    canSeeActionNeededDashboards,
    canSeeOverviewDashboard,
    canSeeWorkflowDashboard,
    canSeeApprovalsDashboard,
    canSeeCasesToAssignDashboard,
    canSeeSharedFromMyTeamDashboard,
    canSeeSharedWithMyTeamDashboard,
    canSeeOverdueTasksDashboard,
    canSeeCasesBySocialWorkerDashboard,
    canSeeWorkflowTeamDashboard,
    canSeeReportingLocationDashboard,
    canSeeProtectionConcernsDashboard,
    canSeeViolationsCategoryVerificationStatusDashboard,
    canSeeViolationsCategoryRegionDashboard,
    canSeePerpetratorArmedForceGroupPartyNames,
    permittedAbilities
  } = usePermissions(RESOURCES.dashboards, {
    canFetchFlags: [ACTIONS.DASH_FLAGS],
    canSeeSharedWithMe: [ACTIONS.DASH_SHARED_WITH_ME],
    canSeeSharedWithOthers: [ACTIONS.DASH_SHARED_WITH_OTHERS],
    canSeeSharedWithMyTeamOverview: [ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW],
    canSeeActionNeededDashboards: ACTION_NEEDED_DASHBOARD,
    canSeeOverviewDashboard: OVERVIEW_DASHBOARD,
    canSeeWorkflowDashboard: [ACTIONS.DASH_WORKFLOW],
    canSeeApprovalsDashboard: DASH_APPROVALS,
    canSeeCasesToAssignDashboard: [ACTIONS.DASH_CASES_TO_ASSIGN],
    canSeeSharedFromMyTeamDashboard: [ACTIONS.DASH_SHARED_FROM_MY_TEAM],
    canSeeSharedWithMyTeamDashboard: [ACTIONS.DASH_SHARED_WITH_MY_TEAM],
    canSeeOverdueTasksDashboard: OVERDUE_TASKS_DASHBOARD,
    canSeeCasesBySocialWorkerDashboard: [ACTIONS.DASH_CASES_BY_SOCIAL_WORKER],
    canSeeWorkflowTeamDashboard: [ACTIONS.DASH_WORKFLOW_TEAM],
    canSeeReportingLocationDashboard: [ACTIONS.DASH_REPORTING_LOCATION],
    canSeeProtectionConcernsDashboard: [ACTIONS.DASH_PROTECTION_CONCERNS],
    canSeeViolationsCategoryVerificationStatusDashboard: [ACTIONS.DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS],
    canSeeViolationsCategoryRegionDashboard: [ACTIONS.DASH_VIOLATIONS_CATEGORY_REGION],
    canSeePerpetratorArmedForceGroupPartyNames: [ACTIONS.DASH_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES]
  });

  const currentUserModules = useMemoizedSelector(state => getCurrentUserModules(state));

  const canSeeReferrals = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]);
  const canSeeTransfers = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_TRANSFER, ACTIONS.MANAGE]);
  const userPermissions = useMemoizedSelector(state => getPermissions(state));

  const showReferralsDashboard = (canSeeReferrals && canSeeSharedWithMe) || canSeeSharedWithOthers;
  const showTransferDashboard =
    canSeeSharedWithMyTeamOverview || canSeeSharedWithOthers || (canSeeSharedWithMe && canSeeTransfers);

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

  const dashboards = [
    { group: DASHBOARD_GROUP.action_needed, permitted: canSeeActionNeededDashboards },
    { group: DASHBOARD_GROUP.overview, permitted: canSeeOverviewDashboard },
    { group: DASHBOARD_GROUP.workflow, permitted: canSeeWorkflowDashboard },
    {
      group: DASHBOARD_GROUP.approvals,
      permitted: canSeeApprovalsDashboard,
      fetchAction: fetchDashboardApprovals(currentUserModules)
    },
    { group: DASHBOARD_GROUP.referrals_transfers, permitted: showReferralsDashboard || showTransferDashboard },
    { group: DASHBOARD_GROUP.cases_to_assign, permitted: canSeeCasesToAssignDashboard },
    { group: DASHBOARD_GROUP.shared_from_my_team, permitted: canSeeSharedFromMyTeamDashboard },
    { group: DASHBOARD_GROUP.shared_with_my_team, permitted: canSeeSharedWithMyTeamDashboard },
    { group: DASHBOARD_GROUP.overdue_tasks, permitted: canSeeOverdueTasksDashboard },
    { group: DASHBOARD_GROUP.cases_by_social_worker, permitted: canSeeCasesBySocialWorkerDashboard },
    { group: DASHBOARD_GROUP.workflow_team, permitted: canSeeWorkflowTeamDashboard },
    { group: DASHBOARD_GROUP.reporting_location, permitted: canSeeReportingLocationDashboard },
    { group: DASHBOARD_GROUP.protection_concerns, permitted: canSeeProtectionConcernsDashboard },
    {
      group: DASHBOARD_GROUP.violations_category_verification_status,
      permitted: canSeeViolationsCategoryVerificationStatusDashboard
    },
    { group: DASHBOARD_GROUP.violations_category_region, permitted: canSeeViolationsCategoryRegionDashboard },
    {
      group: DASHBOARD_GROUP.perpetrator_armed_force_group_party_names,
      permitted: canSeePerpetratorArmedForceGroupPartyNames
    },
    {
      group: DASHBOARD_GROUP.flags,
      permitted: canFetchFlags,
      fetchAction: fetchFlags(RECORD_PATH.cases, true)
    }
  ];

  useEffect(() => {
    dashboards.forEach(dashboard => {
      if (dashboard.permitted) {
        if (dashboard.fetchAction) {
          dispatch(dashboard.fetchAction);
        } else {
          dispatch(fetchDashboards({ group: dashboard.group }));
        }
      }
    });
  }, []);

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")} />
      <PageContent>
        <OfflineAlert text={i18n.t("messages.dashboard_offline")} />
        <Grid container spacing={3}>
          {canSeeOverviewDashboard && (
            <Grid item xl={xlSizeOverview} md={xlSizeOverview} xs={12} className={css.flex}>
              <Overview />
            </Grid>
          )}
          {canSeeActionNeededDashboards && (
            <Grid item xl={xlSizeActionNeeded} md={xlSizeActionNeeded} xs={12} className={css.flex}>
              <ActionNeeded userPermissions={userPermissions} />
            </Grid>
          )}
          {canSeeWorkflowDashboard && (
            <Grid item xl={12} md={12} xs={12}>
              <WorkflowIndividualCases />
            </Grid>
          )}
          <Grid item xl={xlSize} md={mdSize} xs={12} className={css.flexFlow}>
            {permittedColumnDashboards.map(dashboard => (
              <dashboard.component userPermissions={userPermissions} />
            ))}
          </Grid>
          {canFetchFlags && (
            <Grid item xl={xlSizeFlags} md={mdSizeFlags} xs={12} className={css.flex}>
              <Flags />
            </Grid>
          )}
          <Grid item xl={12} md={12} xs={12}>
            {permittedTableDashboards.map(dashboard => (
              <dashboard.component userPermissions={userPermissions} />
            ))}
          </Grid>
        </Grid>
      </PageContent>
    </PageContainer>
  );
}

Dashboard.displayName = NAME;

export default Dashboard;
