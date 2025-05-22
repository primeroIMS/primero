// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";

import { useMemoizedSelector } from "../../../../../libs";
import {
  getActionNeededNewReferrals,
  getActionNeededNewUpdated,
  getActionNeededTransferAwaitingAcceptance,
  getDashboardsByGroup
} from "../../selectors";
import { DASHBOARD_GROUP, DASHBOARD_TYPES } from "../../constants";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { useI18n } from "../../../../i18n";
import DashboardColumns from "../../../../dashboard/dashboard-columns";
import { ACTION_NEEDED_DASHBOARD } from "../../../../permissions/constants";

function Component() {
  const i18n = useI18n();

  const loading = useMemoizedSelector(state =>
    getDashboardsByGroup(state, DASHBOARD_GROUP.action_needed).get("loading", false)
  );
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

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTION_NEEDED_DASHBOARD}>
      <OptionsBox
        title={i18n.t("dashboard.action_needed.header")}
        loading={loading}
        hasData={actionNeededHasData && !loading}
      >
        <DashboardColumns columns={columns} keepRows />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = "DashboardActionNeeded";

export default Component;
