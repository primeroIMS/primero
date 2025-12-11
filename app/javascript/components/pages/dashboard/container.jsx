// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../i18n";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { getCurrentUserModules } from "../../user/selectors";
import { OfflineAlert } from "../../disable-offline";
import { usePermissions, ACTIONS, RESOURCES, DASH_APPROVALS } from "../../permissions";
import { useMemoizedSelector } from "../../../libs";
import { ACTION_NEEDED_DASHBOARD, OVERDUE_TASKS_DASHBOARD, OVERVIEW_DASHBOARD } from "../../permissions/constants";
import { RECORD_PATH } from "../../../config";

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
import { DASHBOARD_GROUPS_WITH_MODULES, DASHBOARD_GROUPS_WITHOUT_MODULES, NAME } from "./constants";
import { fetchDashboardsByName, fetchFlags } from "./action-creators";
import css from "./styles.css";
import permittedDashboards from "./utils/permitted-dashboards";
import { permittedDashboardNames } from "./utils";

const tableDashboards = [
  { key: "shared-from-my-team", component: SharedFromMyTeam, actions: [ACTIONS.DASH_SHARED_FROM_MY_TEAM] },
  { key: "shared-with-my-team", component: SharedWithMyTeam, actions: [ACTIONS.DASH_SHARED_WITH_MY_TEAM] },
  { key: "overdue-tasks", component: OverdueTasks, actions: OVERDUE_TASKS_DASHBOARD },
  { key: "cases-by-social-worker", component: CasesBySocialWorker, actions: [ACTIONS.DASH_CASES_BY_SOCIAL_WORKER] },
  { key: "workflow-team-cases", component: WorkflowTeamCases, actions: [ACTIONS.DASH_WORKFLOW_TEAM] },
  { key: "reporting-location", component: ReportingLocation, actions: [ACTIONS.DASH_REPORTING_LOCATION] },
  { key: "protection-concern", component: ProtectionConcern, actions: [ACTIONS.DASH_PROTECTION_CONCERNS] },
  {
    key: "violations-category-verification-status",
    component: ViolationsCategoryVerificationStatus,
    actions: [ACTIONS.DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS]
  },
  {
    key: "violations-category-region",
    component: ViolationsCategoryRegion,
    actions: [ACTIONS.DASH_VIOLATIONS_CATEGORY_REGION]
  },
  {
    key: "perpetrator-armed-force-group-party-names",
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
    permittedAbilities
  } = usePermissions(RESOURCES.dashboards, {
    canFetchFlags: [ACTIONS.DASH_FLAGS],
    canSeeSharedWithMe: [ACTIONS.DASH_SHARED_WITH_ME],
    canSeeSharedWithOthers: [ACTIONS.DASH_SHARED_WITH_OTHERS],
    canSeeSharedWithMyTeamOverview: [ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW],
    canSeeActionNeededDashboards: ACTION_NEEDED_DASHBOARD,
    canSeeOverviewDashboard: OVERVIEW_DASHBOARD,
    canSeeWorkflowDashboard: [ACTIONS.DASH_WORKFLOW]
  });

  const currentUserModules = useMemoizedSelector(state => getCurrentUserModules(state));

  const canSeeReferrals = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]);
  const canSeeTransfers = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_TRANSFER, ACTIONS.MANAGE]);

  const showReferralsDashboard = (canSeeReferrals && canSeeSharedWithMe) || canSeeSharedWithOthers;
  const showTransferDashboard =
    canSeeSharedWithMyTeamOverview || canSeeSharedWithOthers || (canSeeSharedWithMe && canSeeTransfers);

  const xlSize = canFetchFlags ? 9 : 12;
  const mdSize = canFetchFlags ? 8 : 12;

  const xlSizeOverview = canSeeActionNeededDashboards ? 4 : 12;
  const xlSizeActionNeeded = canSeeOverviewDashboard ? 8 : 12;

  const columnDashboards = [
    { key: "approvals", component: Approvals, actions: DASH_APPROVALS },
    {
      key: "referrals-and-transfers",
      component: ReferralsAndTransfers,
      actions: [],
      permitted: showReferralsDashboard || showTransferDashboard
    },
    { key: "cases-to-assign", component: CasesToAssign, actions: [ACTIONS.DASH_CASES_TO_ASSIGN] }
  ];

  const [permittedColumnDashboards, permittedTableDashboards] = permittedDashboards({
    columnDashboards,
    permittedAbilities,
    tableDashboards
  });

  const xlSizeFlags = permittedColumnDashboards.length > 0 ? 3 : 12;
  const mdSizeFlags = permittedColumnDashboards.length > 0 ? 4 : 12;

  useEffect(() => {
    if (!currentUserModules.isEmpty() && !permittedAbilities.isEmpty()) {
      Object.entries(DASHBOARD_GROUPS_WITH_MODULES).forEach(([group, names]) => {
        currentUserModules.forEach(primeroModule => {
          const permittedNames = permittedDashboardNames({ names, permittedAbilities }).map(
            permittedName => `${permittedName}.${primeroModule}`
          );

          if (!isEmpty(permittedNames)) {
            dispatch(fetchDashboardsByName({ group, names: permittedNames }));
          }
        });
      });
    }
  }, [currentUserModules.isEmpty(), permittedAbilities.isEmpty()]);

  useEffect(() => {
    if (!permittedAbilities.isEmpty()) {
      Object.entries(DASHBOARD_GROUPS_WITHOUT_MODULES).forEach(([group, names]) => {
        const permittedNames = permittedDashboardNames({ names, permittedAbilities });

        if (!isEmpty(permittedNames)) {
          dispatch(fetchDashboardsByName({ group, names: permittedNames }));
        }
      });
    }
  }, [permittedAbilities.isEmpty()]);

  useEffect(() => {
    if (canFetchFlags) {
      dispatch(fetchFlags(RECORD_PATH.cases, true));
    }
  }, [canFetchFlags]);

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
              <ActionNeeded />
            </Grid>
          )}
          {canSeeWorkflowDashboard && (
            <Grid item xl={12} md={12} xs={12}>
              <WorkflowIndividualCases />
            </Grid>
          )}
          <Grid item xl={xlSize} md={mdSize} xs={12} className={css.flexFlow}>
            {permittedColumnDashboards.map(dashboard => (
              <dashboard.component key={dashboard.key} />
            ))}
          </Grid>
          {canFetchFlags && (
            <Grid item xl={xlSizeFlags} md={mdSizeFlags} xs={12} className={css.flex}>
              <Flags />
            </Grid>
          )}
          <Grid item xl={12} md={12} xs={12}>
            {permittedTableDashboards.map(dashboard => (
              <dashboard.component key={dashboard.key} />
            ))}
          </Grid>
        </Grid>
      </PageContent>
    </PageContainer>
  );
}

Dashboard.displayName = NAME;

export default Dashboard;
