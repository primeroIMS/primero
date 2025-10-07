// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getReportingLocation } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toReportingLocationTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { getLocations } from "../../../../record-form";
import { getReportingLocationConfig } from "../../../../user/selectors";
import { ROUTES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();
  const loading = useMemoizedSelector(state => getIsDashboardGroupLoading(state, DASHBOARD_GROUP.reporting_location));
  const locations = useMemoizedSelector(state => getLocations(state));
  const reportingLocationConfig = useMemoizedSelector(state => getReportingLocationConfig(state));
  const reportingLocation = useMemoizedSelector(state => getReportingLocation(state));

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_REPORTING_LOCATION}>
      <OptionsBox title={i18n.t("cases.label")} hasData={Boolean(reportingLocation.size) && !loading} loading={loading}>
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("cases.label")}
          {...toReportingLocationTable(reportingLocation, reportingLocationConfig, i18n, locations)}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
