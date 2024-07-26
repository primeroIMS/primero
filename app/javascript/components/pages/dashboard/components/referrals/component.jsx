// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { DASHBOARD_TYPES } from "../../constants";
import { useI18n } from "../../../../i18n";
import { permittedSharedWithMe, dashboardType, filterIndicatorsByKey } from "../../utils";
import { getSharedWithMe, getSharedWithOthers } from "../../selectors";
import { useMemoizedSelector } from "../../../../../libs";
import css from "../styles.css";

const sharedWithMeIndicators = ["shared_with_me_new_referrals", "shared_with_me_total_referrals"];
const sharedWithOthersIndicators = ["shared_with_others_referrals"];

function Component({ loadingIndicator, userPermissions }) {
  const i18n = useI18n();
  const sharedWithMe = useMemoizedSelector(state => getSharedWithMe(state));
  const sharedWithOthers = useMemoizedSelector(state => getSharedWithOthers(state));
  const referralsDashHasData = Boolean(sharedWithMe.size || sharedWithOthers.size);

  const dashboards = [
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_SHARED_WITH_ME,
      options: {
        items: filterIndicatorsByKey(permittedSharedWithMe(sharedWithMe, userPermissions), sharedWithMeIndicators),
        sumTitle: i18n.t("dashboard.dash_shared_with_me"),
        withTotal: false
      }
    },
    {
      type: DASHBOARD_TYPES.OVERVIEW_BOX,
      actions: ACTIONS.DASH_SHARED_WITH_OTHERS,
      options: {
        items: filterIndicatorsByKey(sharedWithOthers, sharedWithOthersIndicators),
        sumTitle: i18n.t("dashboard.dash_shared_with_others"),
        withTotal: false
      }
    }
  ];

  const renderDashboards = () => {
    return dashboards.map((dashboard, index) => {
      const { type, actions, options } = dashboard;
      const Dashboard = dashboardType(type);

      return (
        <Permission key={actions} resources={RESOURCES.dashboards} actions={actions}>
          <div className={css.optionsBox}>
            <OptionsBox flat>
              <Dashboard {...options} />
            </OptionsBox>
          </div>
          {index === dashboards.length - 1 || <div className={css.divider} />}
        </Permission>
      );
    });
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={dashboards.map(dashboard => dashboard.actions).flat()}>
      <OptionsBox
        title={i18n.t("dashboard.action_needed.referrals")}
        hasData={referralsDashHasData || false}
        {...loadingIndicator}
      >
        <div className={css.container}>{renderDashboards()}</div>
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
