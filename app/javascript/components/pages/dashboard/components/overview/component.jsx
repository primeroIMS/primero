// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";
import PropTypes from "prop-types";

import Permission, { RESOURCES, ACTIONS, usePermissions } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { INDICATOR_NAMES, DASHBOARD_TYPES } from "../../constants";
import { useI18n } from "../../../../i18n";
import {
  getCasesByAssessmentLevel,
  getGroupOverview,
  getCaseOverview,
  getCaseIncidentOverview,
  getNationalAdminSummary
} from "../../selectors";
import { getOption } from "../../../../record-form";
import { LOOKUPS } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import DashboardColumns from "../../../../dashboard/dashboard-columns";

import { NAME } from "./constants";

function Component({ loadingIndicator }) {
  const i18n = useI18n();

  const casesByAssessmentLevel = useMemoizedSelector(state => getCasesByAssessmentLevel(state));
  const groupOverview = useMemoizedSelector(state => getGroupOverview(state));
  const caseOverview = useMemoizedSelector(state => getCaseOverview(state));
  const labelsRiskLevel = useMemoizedSelector(state => getOption(state, LOOKUPS.risk_level, i18n.locale));
  const caseIncidentOverview = useMemoizedSelector(state => getCaseIncidentOverview(state));
  const nationalAdminSummary = useMemoizedSelector(state => getNationalAdminSummary(state));
  const canSeeIncidentOverview = usePermissions(RESOURCES.dashboards, [ACTIONS.DASH_CASE_INCIDENT_OVERVIEW]);

  const overviewDashHasData = Boolean(
    casesByAssessmentLevel.size ||
      groupOverview.size ||
      caseOverview.size ||
      nationalAdminSummary.size ||
      caseIncidentOverview.size
  );

  const incidentOverviewDashboard = {
    type: DASHBOARD_TYPES.OVERVIEW_BOX,
    actions: ACTIONS.DASH_CASE_INCIDENT_OVERVIEW,
    options: {
      items: caseIncidentOverview,
      highlights: ["new_or_updated", "with_new_incidents"],
      sumTitle: i18n.t("dashboard.dash_case_incident_overview"),
      withTotal: false
    }
  };

  const caseOverviewDashboard = {
    type: DASHBOARD_TYPES.OVERVIEW_BOX,
    actions: ACTIONS.DASH_CASE_OVERVIEW,
    options: {
      items: caseOverview,
      sumTitle: i18n.t("dashboard.case_overview"),
      withTotal: false
    }
  };

  const columns = [
    [
      {
        type: DASHBOARD_TYPES.BADGED_INDICATOR,
        actions: ACTIONS.DASH_CASE_RISK,
        options: {
          data: casesByAssessmentLevel,
          sectionTitle: i18n.t("dashboard.case_risk"),
          indicator: INDICATOR_NAMES.RISK_LEVEL,
          lookup: labelsRiskLevel
        }
      }
    ],
    [
      canSeeIncidentOverview ? incidentOverviewDashboard : caseOverviewDashboard,
      {
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: ACTIONS.DASH_GROUP_OVERVIEW,
        options: {
          items: groupOverview,
          sumTitle: i18n.t("dashboard.dash_group_overview"),
          withTotal: false
        }
      },
      {
        type: DASHBOARD_TYPES.OVERVIEW_BOX,
        actions: ACTIONS.DASH_NATIONAL_ADMIN_SUMMARY,
        options: {
          items: nationalAdminSummary,
          sumTitle: i18n.t("dashboard.dash_national_admin_summary"),
          withTotal: false
        }
      }
    ]
  ];

  const dashboardActions = useMemo(
    () =>
      columns
        .flat()
        .map(dashboard => dashboard.actions)
        .flat(),
    [columns.length]
  );

  return (
    <Permission resources={RESOURCES.dashboards} actions={dashboardActions}>
      <OptionsBox title={i18n.t("dashboard.overview")} hasData={overviewDashHasData || false} {...loadingIndicator}>
        <DashboardColumns columns={columns} />
      </OptionsBox>
    </Permission>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object,
  userPermissions: PropTypes.object
};

export default Component;
