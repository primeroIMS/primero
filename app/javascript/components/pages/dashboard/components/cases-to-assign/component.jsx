// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { LOOKUPS, ROUTES } from "../../../../../config";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { useI18n } from "../../../../i18n";
import { useMemoizedSelector } from "../../../../../libs";
import { getCasesToAssign, getIsDashboardGroupLoading } from "../../selectors";
import { toCasesToAssignTable } from "../../utils";
import useOptions from "../../../../form/use-options";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();

  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.cases_to_assign));
  const casesToAssign = useMemoizedSelector(state => getCasesToAssign(state));
  const options = useOptions({ source: LOOKUPS.risk_level });

  const hasData = Boolean(casesToAssign.get("indicators", fromJS({})).size);

  const casesToAssignTableProps = toCasesToAssignTable(casesToAssign, options, i18n);

  return (
    <Permission resources={RESOURCES.dashboards} actions={[ACTIONS.DASH_CASES_TO_ASSIGN]}>
      <OptionsBox title={i18n.t("dashboard.cases_to_assign")} hasData={hasData && !loading} loading={loading}>
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.cases_to_assign")}
          {...casesToAssignTableProps}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
