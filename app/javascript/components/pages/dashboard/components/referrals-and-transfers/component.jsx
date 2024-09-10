// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Grid } from "@mui/material";

import { ACTIONS, RESOURCES, usePermissions } from "../../../../permissions";
import Referrals from "../referrals";
import Transfers from "../transfers";
import css from "../../styles.css";

function ReferralsAndTransfers({ indicatorProps, userPermissions }) {
  const canSeeReferrals = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]);
  const canSeeTransfers = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_TRANSFER, ACTIONS.MANAGE]);
  const canSeeSharedWithMe = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_SHARED_WITH_ME]);
  const canSeeSharedWithOthers = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_SHARED_WITH_OTHERS]);
  const canSeeSharedWithMyTeamOverview = usePermissions(RESOURCES.dashboards, [
    ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW
  ]);

  const showReferralsDashboard = (canSeeReferrals && canSeeSharedWithMe) || canSeeSharedWithOthers;
  const showTransferDashboard =
    canSeeSharedWithMyTeamOverview || canSeeSharedWithOthers || (canSeeSharedWithMe && canSeeTransfers);

  const xlSizeTransition = showReferralsDashboard && showTransferDashboard ? 6 : 12;
  const mdSizeTransition = showReferralsDashboard && showTransferDashboard ? 6 : 12;

  return (
    <Grid container spacing={1} className={css.flexGrow}>
      {showReferralsDashboard && (
        <Grid item xl={xlSizeTransition} md={mdSizeTransition} xs={12} className={css.flex}>
          <Referrals loadingIndicator={indicatorProps} userPermissions={userPermissions} />
        </Grid>
      )}
      {showTransferDashboard && (
        <Grid item xl={xlSizeTransition} md={mdSizeTransition} xs={12} className={css.flex}>
          <Transfers loadingIndicator={indicatorProps} userPermissions={userPermissions} />
        </Grid>
      )}
    </Grid>
  );
}

ReferralsAndTransfers.displayName = "ReferralsAndTransfers";

ReferralsAndTransfers.propTypes = {
  indicatorProps: PropTypes.object,
  userPermissions: PropTypes.object
};

export default ReferralsAndTransfers;
