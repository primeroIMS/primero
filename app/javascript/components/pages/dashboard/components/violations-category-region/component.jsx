// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getViolationsCategoryRegion } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { LOOKUPS, ROUTES } from "../../../../../config";
import useOptions from "../../../../form/use-options";
import { useMemoizedSelector } from "../../../../../libs";
import { OPTION_TYPES } from "../../../../form";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";
import { getVerifiedData } from "./utils";

function Component() {
  const i18n = useI18n();

  const { violationTypes, reportingLocations } = useOptions({
    source: [
      ["reportingLocations", OPTION_TYPES.LOCATION],
      ["violationTypes", LOOKUPS.violation_type]
    ],
    useIncidentReportingLocationConfig: true,
    useReportingLocationName: true
  });
  const loading = useMemoizedSelector(state =>
    getIsDashboardGroupLoading(state, DASHBOARD_GROUP.violations_category_region)
  );
  const violationsCategoryRegion = useMemoizedSelector(state => getViolationsCategoryRegion(state));

  const verifiedData = getVerifiedData(violationsCategoryRegion);

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_VIOLATIONS_CATEGORY_REGION}>
      <OptionsBox
        title={i18n.t("dashboard.dash_violations_category_region")}
        hasData={!loading && Boolean(violationsCategoryRegion.size)}
        loading={loading}
      >
        <DashboardTable
          pathname={ROUTES.incidents}
          title={i18n.t("dashboard.dash_violations_category_region")}
          {...toListTable(verifiedData, violationTypes, reportingLocations, i18n.locale)}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
