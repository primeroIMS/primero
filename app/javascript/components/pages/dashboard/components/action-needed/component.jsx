// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";
import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../../../libs";
import {
  getActionNeededNewReferrals,
  getActionNeededNewUpdated,
  getActionNeededTransferAwaitingAcceptance
} from "../../selectors";
import { DASHBOARD_TYPES } from "../../constants";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { useI18n } from "../../../../i18n";
import DashboardColumns from "../../../../dashboard/dashboard-columns";

function Component({ loadingIndicator }) {
  const i18n = useI18n();

  const actionNeededNewUpdated = useMemoizedSelector(state => getActionNeededNewUpdated(state));
  const actionNeededNewReferrals = useMemoizedSelector(state => getActionNeededNewReferrals(state));
  const actionNeededTransferAwaitingAcceptance = useMemoizedSelector(state =>
    getActionNeededTransferAwaitingAcceptance(state)
  );

  const actionNeededHasData = Boolean(
    actionNeededNewUpdated.size || actionNeededNewReferrals.size || actionNeededTransferAwaitingAcceptance.size
  );

  const columns = useMemo(
    () => [
      [
        {
          type: DASHBOARD_TYPES.TOTAL_BOX,
          actions: ACTIONS.DASH_ACTION_NEEDED_NEW_UPDATED,
          options: {
            data: actionNeededNewUpdated,
            title: i18n.t("dashboard.action_needed.cases")
          }
        }
      ],
      [
        {
          type: DASHBOARD_TYPES.TOTAL_BOX,
          actions: ACTIONS.DASH_ACTION_NEEDED_NEW_REFERRALS,
          options: {
            data: actionNeededNewReferrals,
            title: i18n.t("dashboard.action_needed.referrals")
          }
        }
      ],
      [
        {
          type: DASHBOARD_TYPES.TOTAL_BOX,
          actions: ACTIONS.DASH_ACTION_NEEDED_TRANSFER_AWAITING_ACCEPTANCE,
          options: {
            data: actionNeededTransferAwaitingAcceptance,
            title: i18n.t("dashboard.action_needed.transfers")
          }
        }
      ]
    ],
    [actionNeededHasData]
  );

  const dashboardActions = useMemo(
    () =>
      columns
        .flat()
        .map(dashboard => dashboard.actions)
        .flat(),
    [columns.length]
  );

  return (
    <Permission resources={RESOURCES.dashboards} actions={dashboardActions}>
      <OptionsBox title={i18n.t("dashboard.action_needed.header")} hasData={actionNeededHasData} {...loadingIndicator}>
        <DashboardColumns columns={columns} keepRows />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = "DashboardActionNeeded";

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
