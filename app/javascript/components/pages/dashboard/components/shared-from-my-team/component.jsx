// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getSharedFromMyTeam } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { teamSharingTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();
  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.shared_from_my_team));
  const sharedFromMyTeam = useMemoizedSelector(state => getSharedFromMyTeam(state));

  const sharedFromMyTeamProps = {
    ...teamSharingTable(sharedFromMyTeam, i18n)
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_SHARED_FROM_MY_TEAM}>
      <OptionsBox
        title={i18n.t("dashboard.dash_shared_from_my_team")}
        loading={loading}
        hasData={!loading && Boolean(sharedFromMyTeam.size)}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.dash_shared_from_my_team")}
          {...sharedFromMyTeamProps}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
