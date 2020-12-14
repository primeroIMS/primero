import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getReportingLocation } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toReportingLocationTable } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { getLocations } from "../../../../record-form";
import { getReportingLocationConfig } from "../../../../user/selectors";
import { ROUTES } from "../../../../../config";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const locations = useSelector(state => getLocations(state));
  const reportingLocationConfig = useSelector(state => getReportingLocationConfig(state));
  const reportingLocation = useSelector(state => getReportingLocation(state));

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_REPORTING_LOCATION}>
      <OptionsBox title={i18n.t("cases.label")} hasData={Boolean(reportingLocation.size)} {...loadingIndicator}>
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("cases.label")}
          {...toReportingLocationTable(reportingLocation, reportingLocationConfig, i18n, locations)}
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
