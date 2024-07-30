// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import Permission, { usePermissions, RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { DASHBOARD_TYPES } from "../../constants";
import { useI18n } from "../../../../i18n";
import { permittedSharedWithMe, filterIndicatorsByKey } from "../../utils";
import { getSharedWithMe, getSharedWithMyTeamOverview, getSharedWithOthers } from "../../selectors";
import { useMemoizedSelector } from "../../../../../libs";
import DashboardList from "../overview/dashboard-list";

const sharedWithMeIndicators = ["shared_with_me_transfers_awaiting_acceptance"];
const sharedWithOthersIndicators = ["shared_with_others_pending_transfers", "shared_with_others_rejected_transfers"];

function Component({ loadingIndicator, userPermissions }) {
  const i18n = useI18n();
  const sharedWithMe = useMemoizedSelector(state => getSharedWithMe(state));
  const sharedWithOthers = useMemoizedSelector(state => getSharedWithOthers(state));
  const sharedWithMyTeamOverview = useMemoizedSelector(state => getSharedWithMyTeamOverview(state));
  const canSeeSharedWithMeTransfers = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_TRANSFER, ACTIONS.MANAGE]);
  const canSeeSharedWithMyTeamDashboard = usePermissions(RESOURCES.dashboards, [
    ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW
  ]);
  const canSeeSharedWithOthers = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_SHARED_WITH_OTHERS]);

  const transfersDashHasData = Boolean(sharedWithMe.size || sharedWithOthers.size || sharedWithMyTeamOverview.size);

  const dashboards = [];

  const sharedWithMyTeamDashboard = {
    type: DASHBOARD_TYPES.OVERVIEW_BOX,
    actions: ACTIONS.DASH_SHARED_WITH_MY_TEAM_OVERVIEW,
    options: {
      items: sharedWithMyTeamOverview,
      sumTitle: i18n.t("dashboard.dash_shared_with_my_team_overview"),
      withTotal: false
    }
  };

  if (canSeeSharedWithMeTransfers) {
    dashboards.push({
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_SHARED_WITH_ME,
      options: {
        items: filterIndicatorsByKey(permittedSharedWithMe(sharedWithMe, userPermissions), sharedWithMeIndicators),
        sumTitle: i18n.t("dashboard.dash_shared_with_me"),
        withTotal: false,
        subColumns: [{ actions: sharedWithMyTeamDashboard.actions, ...sharedWithMyTeamDashboard.options }]
      }
    });
  } else if (canSeeSharedWithMyTeamDashboard) {
    dashboards.push(sharedWithMyTeamDashboard);
  }

  if (canSeeSharedWithOthers) {
    dashboards.push({
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_SHARED_WITH_OTHERS,
      options: {
        items: filterIndicatorsByKey(sharedWithOthers, sharedWithOthersIndicators),
        sumTitle: i18n.t("dashboard.dash_shared_with_others"),
        withTotal: false
      }
    });
  }

  return (
    <Permission resources={RESOURCES.dashboards} actions={dashboards.map(dashboard => dashboard.actions).flat()}>
      <OptionsBox
        title={i18n.t("dashboard.action_needed.transfers")}
        hasData={transfersDashHasData || false}
        {...loadingIndicator}
      >
        <DashboardList dashboards={dashboards} />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = "Transfers";

Component.propTypes = {
  loadingIndicator: PropTypes.object,
  userPermissions: PropTypes.object
};

export default Component;
