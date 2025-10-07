// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getSharedWithMyTeam } from "../../selectors";
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
  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.shared_with_my_team));
  const sharedWithMyTeam = useMemoizedSelector(state => getSharedWithMyTeam(state));

  const sharedWithMyTeamProps = {
    ...teamSharingTable(sharedWithMyTeam, i18n)
  };

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_SHARED_WITH_MY_TEAM}>
      <OptionsBox
        title={i18n.t("dashboard.dash_shared_with_my_team")}
        loading={loading}
        hasData={!loading && Boolean(sharedWithMyTeam.size)}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.dash_shared_with_my_team")}
          {...sharedWithMyTeamProps}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
