// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";

import { useI18n } from "../../i18n";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { getPermissions } from "../../user/selectors";
import { getLoading, getErrors } from "../../index-table";
import { OfflineAlert } from "../../disable-offline";
import { usePermissions, ACTIONS, RESOURCES } from "../../permissions";
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
  Referrals,
  ReportingLocation,
  SharedFromMyTeam,
  SharedWithMyTeam,
  Transfers,
  ViolationsCategoryRegion,
  ViolationsCategoryVerificationStatus,
  WorkflowIndividualCases,
  WorkflowTeamCases
} from "./components";
import NAMESPACE from "./namespace";
import { NAME } from "./constants";
import { fetchDashboards, fetchFlags } from "./action-creators";

function Dashboard() {
  const i18n = useI18n();
  const dispatch = useDispatch();
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
  const canSeeOverviewDashboard = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_CASE_OVERVIEW]);

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

  const xlSizeTransition = showReferralsDashboard && showTransferDashboard ? 6 : 12;
  const mdSizeTransition = showReferralsDashboard && showTransferDashboard ? 6 : 12;

  const xlSizeOverview = canSeeActionNeededDashboards ? 4 : 12;
  const xlSizeActionNeeded = canSeeOverviewDashboard ? 8 : 12;

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")} />
      <PageContent>
        <OfflineAlert text={i18n.t("messages.dashboard_offline")} />
        <Grid container spacing={3}>
          <Grid item xl={xlSizeOverview} md={xlSizeOverview} xs={12}>
            <Overview loadingIndicator={indicatorProps} userPermissions={userPermissions} />
          </Grid>
          <Grid item xl={xlSizeActionNeeded} md={xlSizeActionNeeded} xs={12}>
            <ActionNeeded loadingIndicator={indicatorProps} userPermissions={userPermissions} />
          </Grid>
          <Grid item xl={xlSize} md={mdSize} xs={12}>
            <WorkflowIndividualCases loadingIndicator={indicatorProps} />
            <Approvals loadingIndicator={indicatorProps} />
            <Grid container spacing={1}>
              {showReferralsDashboard && (
                <Grid item xl={xlSizeTransition} md={mdSizeTransition} xs={12}>
                  <Referrals loadingIndicator={indicatorProps} userPermissions={userPermissions} />
                </Grid>
              )}
              {showTransferDashboard && (
                <Grid item xl={xlSizeTransition} md={mdSizeTransition} xs={12}>
                  <Transfers loadingIndicator={indicatorProps} userPermissions={userPermissions} />
                </Grid>
              )}
            </Grid>
            <CasesToAssign loadingIndicator={indicatorProps} />
            <SharedFromMyTeam loadingIndicator={indicatorProps} />
            <SharedWithMyTeam loadingIndicator={indicatorProps} />
            <OverdueTasks loadingIndicator={indicatorProps} />
            <CasesBySocialWorker loadingIndicator={indicatorProps} />
            <WorkflowTeamCases loadingIndicator={indicatorProps} />
            <ReportingLocation loadingIndicator={indicatorProps} />
            <ProtectionConcern loadingIndicator={indicatorProps} />
            <ViolationsCategoryVerificationStatus loadingIndicator={indicatorProps} />
            <ViolationsCategoryRegion loadingIndicator={indicatorProps} />
            <PerpetratorArmedForceGroupPartyNames loadingIndicator={indicatorProps} />
          </Grid>
          {canFetchFlags && (
            <Grid item xl={3} md={4} xs={12}>
              <Flags loadingIndicator={flagsIndicators} />
            </Grid>
          )}
        </Grid>
      </PageContent>
    </PageContainer>
  );
}

Dashboard.displayName = NAME;

export default Dashboard;
