// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";
import PropTypes from "prop-types";

import Permission, { usePermissions, RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { DASHBOARD_TYPES } from "../../constants";
import { useI18n } from "../../../../i18n";
import { permittedSharedWithMe, filterIndicatorsByKey } from "../../utils";
import { getSharedWithMe, getSharedWithOthers } from "../../selectors";
import { useMemoizedSelector } from "../../../../../libs";
import DashboardColumns from "../../../../dashboard/dashboard-columns";

const sharedWithMeIndicators = ["shared_with_me_new_referrals", "shared_with_me_total_referrals"];
const sharedWithOthersIndicators = ["shared_with_others_referrals"];

function Component({ loadingIndicator, userPermissions }) {
  const i18n = useI18n();
  const canSeeSharedWithMeIndicators = usePermissions(RESOURCES.cases, [ACTIONS.RECEIVE_REFERRAL, ACTIONS.MANAGE]);
  const canSeeSharedWithOthers = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_SHARED_WITH_OTHERS]);
  const sharedWithMe = useMemoizedSelector(state => getSharedWithMe(state));
  const sharedWithOthers = useMemoizedSelector(state => getSharedWithOthers(state));

  const referralsDashHasData = Boolean(sharedWithMe.size || sharedWithOthers.size);

  const columns = [];

  if (canSeeSharedWithMeIndicators) {
    columns.push([
      {
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: ACTIONS.DASH_SHARED_WITH_ME,
        options: {
          items: filterIndicatorsByKey(permittedSharedWithMe(sharedWithMe, userPermissions), sharedWithMeIndicators),
          sumTitle: i18n.t("dashboard.dash_shared_with_me"),
          withTotal: false,
          highlights: ["shared_with_me_new_referrals"]
        }
      }
    ]);
  }

  if (canSeeSharedWithOthers) {
    columns.push([
      {
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: ACTIONS.DASH_SHARED_WITH_OTHERS,
        options: {
          items: filterIndicatorsByKey(sharedWithOthers, sharedWithOthersIndicators),
          sumTitle: i18n.t("dashboard.dash_shared_with_others"),
          withTotal: false
        }
      }
    ]);
  }

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
      <OptionsBox
        title={i18n.t("dashboard.action_needed.referrals")}
        hasData={referralsDashHasData || false}
        {...loadingIndicator}
      >
        <DashboardColumns columns={columns} />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = "Referrals";

Component.propTypes = {
  loadingIndicator: PropTypes.object,
  userPermissions: PropTypes.object
};

export default Component;
