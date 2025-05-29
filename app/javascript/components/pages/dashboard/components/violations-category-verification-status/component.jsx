// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getIsDashboardGroupLoading, getViolationsCategoryVerificationStatus } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { LOOKUPS, ROUTES } from "../../../../../config";
import useOptions from "../../../../form/use-options";
import { useMemoizedSelector } from "../../../../../libs";
import { DASHBOARD_GROUP } from "../../constants";

import { NAME } from "./constants";
import { transformToPivotedDashboard } from "./utils";

function Component() {
  const i18n = useI18n();

  const { verificationStatus, violationType } = useOptions({
    source: [
      ["verificationStatus", LOOKUPS.verification_status],
      ["violationType", LOOKUPS.violation_type]
    ]
  });

  const loading = useMemoizedSelector(state =>
    getIsDashboardGroupLoading(state, DASHBOARD_GROUP.violations_category_verification_status)
  );
  const violationsCategoryVerificationStatus = useMemoizedSelector(state =>
    getViolationsCategoryVerificationStatus(state)
  );

  const transformed = transformToPivotedDashboard(violationsCategoryVerificationStatus);

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS}>
      <OptionsBox
        title={i18n.t("dashboard.dash_violations_category_verification_status")}
        hasData={!loading && Boolean(violationsCategoryVerificationStatus.size)}
        loading={loading}
      >
        <DashboardTable
          pathname={ROUTES.incidents}
          title={i18n.t("dashboard.dash_violations_category_verification_status")}
          {...toListTable(transformed, verificationStatus, violationType, i18n.locale)}
        />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
