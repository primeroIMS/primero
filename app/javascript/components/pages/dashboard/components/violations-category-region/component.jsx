import PropTypes from "prop-types";

import { getViolationsCategoryRegion } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { LOOKUPS, ROUTES } from "../../../../../config";
import useOptions from "../../../../form/use-options";
import { useMemoizedSelector } from "../../../../../libs";
import { OPTION_TYPES } from "../../../../form";

import { NAME } from "./constants";
import { getVerifiedData } from "./utils";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const { violationTypes, reportingLocations } = useOptions({
    source: [
      ["reportingLocations", OPTION_TYPES.LOCATION],
      ["violationTypes", LOOKUPS.violation_type]
    ],
    useIncidentReportingLocationConfig: true,
    useReportingLocationName: true
  });
  const violationsCategoryRegion = useMemoizedSelector(state => getViolationsCategoryRegion(state));

  const verifiedData = getVerifiedData(violationsCategoryRegion);

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_VIOLATIONS_CATEGORY_REGION}>
      <OptionsBox
        title={i18n.t("dashboard.dash_violations_category_region")}
        hasData={Boolean(violationsCategoryRegion.size)}
        {...loadingIndicator}
      >
        <DashboardTable
          pathname={ROUTES.incidents}
          title={i18n.t("dashboard.dash_violations_category_region")}
          {...toListTable(verifiedData, violationTypes, reportingLocations, i18n.locale)}
        />
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
