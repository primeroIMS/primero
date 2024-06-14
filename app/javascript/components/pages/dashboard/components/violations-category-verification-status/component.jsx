// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { getViolationsCategoryVerificationStatus } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { LOOKUPS, ROUTES } from "../../../../../config";
import useOptions from "../../../../form/use-options";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";
import { transformToPivotedDashboard } from "./utils";

function Component({ loadingIndicator }) {
  const i18n = useI18n();

  const { verificationStatus, violationType } = useOptions({
    source: [
      ["verificationStatus", LOOKUPS.verification_status],
      ["violationType", LOOKUPS.violation_type]
    ]
  });

  const violationsCategoryVerificationStatus = useMemoizedSelector(state =>
    getViolationsCategoryVerificationStatus(state)
  );

  const transformed = transformToPivotedDashboard(violationsCategoryVerificationStatus);

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS}>
      <OptionsBox
        title={i18n.t("dashboard.dash_violations_category_verification_status")}
        hasData={Boolean(violationsCategoryVerificationStatus.size)}
        {...loadingIndicator}
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

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
