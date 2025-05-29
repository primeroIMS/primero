// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getPerpetratorArmedForceGroupPartyNames } from "../../selectors";
import { useI18n } from "../../../../i18n";
import toFacetedTable from "../../utils/to-faceted-table";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { LOOKUPS, ROUTES } from "../../../../../config";
import useOptions from "../../../../form/use-options";
import { useMemoizedSelector } from "../../../../../libs";
import { DASHBOARD_GROUP, INDICATOR_NAMES } from "../../constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();

  const armedForceGroupOrOtherParty = useOptions({ source: LOOKUPS.armed_force_group_or_other_party });
  const loading = useMemoizedSelector(state =>
    getIsDashboardGroupLoading(state, DASHBOARD_GROUP.perpetrator_armed_force_group_party_names)
  );
  const perpetratorArmedForceGroupPartyNames = useMemoizedSelector(state =>
    getPerpetratorArmedForceGroupPartyNames(state)
  );

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES}>
      <OptionsBox
        title={i18n.t("dashboard.dash_perpetrator_armed_force_group_party_names")}
        hasData={!loading && Boolean(perpetratorArmedForceGroupPartyNames.size)}
        loading={loading}
      >
        <DashboardTable
          pathname={ROUTES.incidents}
          title={i18n.t("dashboard.dash_perpetrator_armed_force_group_party_names")}
          {...toFacetedTable(
            perpetratorArmedForceGroupPartyNames,
            i18n.t("dashboard.total"),
            armedForceGroupOrOtherParty,
            INDICATOR_NAMES.PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES
          )}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
